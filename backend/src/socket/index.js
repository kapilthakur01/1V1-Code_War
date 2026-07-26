const jwt = require('jsonwebtoken');
const Room = require('../models/Room');
const Problem = require('../models/Problem');
const Battle = require('../models/Battle');
const User = require('../models/User');
const Submission = require('../models/Submission');
const { judgeCode } = require('../judge/executor');

// Track active timers per room
const roomTimers = new Map();
// Track proctoring violations per room per user
const roomViolations = new Map();

function initSocket(io) {
  // ── Auth middleware ───────────────────────────────────────
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.query?.token;
      if (!token) return next(new Error('Authentication required'));

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
      const user = await User.findById(decoded.id).select('-password');
      if (!user) return next(new Error('User not found'));

      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`✅ Socket connected: ${socket.user.username} (${socket.id})`);

    // ── Join Room ───────────────────────────────────────────
    socket.on('join-room', async (data) => {
      try {
        const { roomId } = data;
        const userId = socket.user._id.toString();

        const room = await Room.findById(roomId).populate('problem');
        if (!room) {
          return socket.emit('error', { message: 'Room not found' });
        }

        // Update player's socketId and connection status
        const playerIdx = room.players.findIndex((p) => p.userId.toString() === userId);
        if (playerIdx === -1) {
          return socket.emit('error', { message: 'You are not in this room' });
        }

        room.players[playerIdx].socketId = socket.id;
        room.players[playerIdx].isConnected = true;
        await room.save();

        socket.join(roomId);
        socket.currentRoomId = roomId;

        // Notify others of connection
        socket.to(roomId).emit('player-connected', {
          userId,
          username: socket.user.username,
        });

        // Send room state to the joining player
        const connectedCount = room.players.filter((p) => p.isConnected).length;

        socket.emit('room-state', {
          room: {
            _id: room._id,
            roomCode: room.roomCode,
            type: room.type,
            status: room.status,
            players: room.players.map((p) => ({
              userId: p.userId,
              username: p.username,
              isConnected: p.isConnected,
              isReady: p.isReady,
            })),
          },
          problem: room.problem
            ? {
                _id: room.problem._id,
                title: room.problem.title,
                difficulty: room.problem.difficulty,
                description: room.problem.description,
                inputFormat: room.problem.inputFormat,
                outputFormat: room.problem.outputFormat,
                constraints: room.problem.constraints,
                sampleTestCases: room.problem.sampleTestCases,
                tags: room.problem.tags,
              }
            : null,
          startTime: room.startTime,
          endTime: room.status === 'active' ? new Date(room.startTime.getTime() + room.duration) : null,
        });

        // Auto-start if both players connected and status is waiting
        if (room.status === 'waiting' && connectedCount === 2 && room.players.length === 2) {
          await startBattle(io, room, roomId);
        }

        // If room is active and player reconnects, sync timer
        if (room.status === 'active' && room.startTime) {
          const elapsed = Date.now() - new Date(room.startTime).getTime();
          const remaining = room.duration - elapsed;
          socket.emit('timer-sync', { remaining: Math.max(0, remaining), startTime: room.startTime });
        }
      } catch (err) {
        console.error('join-room error:', err);
        socket.emit('error', { message: 'Failed to join room' });
      }
    });

    // ── Typing indicator ────────────────────────────────────
    socket.on('typing', (data) => {
      const { roomId, isTyping } = data;
      socket.to(roomId).emit('opponent-typing', {
        userId: socket.user._id,
        username: socket.user.username,
        isTyping,
      });
    });

    // ── Submit solution ─────────────────────────────────────
    socket.on('submit-solution', async (data) => {
      try {
        const { roomId, code, language, problemId } = data;
        const userId = socket.user._id.toString();

        // Notify room that this player submitted
        io.to(roomId).emit('player-submitted', {
          userId,
          username: socket.user.username,
        });

        const problem = await Problem.findById(problemId);
        if (!problem) {
          return socket.emit('submission-error', { message: 'Problem not found' });
        }

        const allTestCases = [
          ...problem.sampleTestCases.map((tc) => ({ ...tc.toObject(), isSample: true })),
          ...problem.hiddenTestCases.map((tc) => ({ ...tc.toObject(), isSample: false })),
        ];

        const judgeResult = await judgeCode(code, language, allTestCases);

        const submission = await Submission.create({
          userId: socket.user._id,
          roomId,
          problemId,
          code,
          language,
          verdict: judgeResult.verdict,
          testsPassed: judgeResult.testsPassed,
          totalTests: judgeResult.totalTests,
          executionTime: judgeResult.executionTime,
          testResults: judgeResult.results,
          isRun: false,
        });

        // Send result to the submitting player
        socket.emit('submission-result', {
          submissionId: submission._id,
          verdict: judgeResult.verdict,
          testsPassed: judgeResult.testsPassed,
          totalTests: judgeResult.totalTests,
          executionTime: judgeResult.executionTime,
        });

        // Check if this submission ends the battle
        if (judgeResult.verdict === 'Accepted') {
          await endBattle(io, roomId, {
            winnerId: userId,
            winnerUsername: socket.user.username,
            winReason: 'First Accepted submission',
            winnerSubmission: submission,
          });
        } else {
          // Check if both players have submitted and neither is accepted
          await checkBattleCompletion(io, roomId);
        }
      } catch (err) {
        console.error('submit-solution error:', err);
        socket.emit('submission-error', { message: 'Submission failed' });
      }
    });

    // ── Proctoring Violation ────────────────────────────────
    socket.on('proctoring-violation', async (data) => {
      try {
        const { roomId, violationType } = data;
        const userId = socket.user._id.toString();

        if (!roomViolations.has(roomId)) roomViolations.set(roomId, {});
        const tracker = roomViolations.get(roomId);
        if (!tracker[userId]) tracker[userId] = 0;

        tracker[userId]++;
        const actionTaken = tracker[userId] >= 3 ? 'termination' : 'warning';

        const ProctoringLog = require('../models/ProctoringLog');
        await ProctoringLog.create({
          userId: socket.user._id,
          roomId,
          violationType,
          actionTaken
        });

        // Terminate on 3rd violation or severe violation
        if (actionTaken === 'termination' || ['dev_tools', 'multiple_faces'].includes(violationType)) {
          const room = await Room.findById(roomId);
          if (room && room.status === 'active') {
             const opponent = room.players.find(p => p.userId.toString() !== userId);
             await endBattle(io, roomId, {
               winnerId: opponent ? opponent.userId : null,
               winnerUsername: opponent ? opponent.username : null,
               winReason: 'Opponent disqualified due to proctoring violation',
               isDraw: false,
             });
          }
        }
      } catch (err) {
        console.error('proctoring-violation error:', err);
      }
    });

    // ── Leave room ──────────────────────────────────────────
    socket.on('leave-room', async (data) => {
      try {
        const { roomId } = data;
        await handlePlayerLeave(io, socket, roomId);
      } catch (err) {
        console.error('leave-room error:', err);
      }
    });

    // ── Disconnect ──────────────────────────────────────────
    socket.on('disconnect', async () => {
      console.log(`❌ Socket disconnected: ${socket.user.username}`);
      if (socket.currentRoomId) {
        await handlePlayerLeave(io, socket, socket.currentRoomId, true);
      }
    });
  });
}

// ── Helpers ─────────────────────────────────────────────────────────────────

async function startBattle(io, room, roomId) {
  const startTime = new Date();
  room.status = 'active';
  room.startTime = startTime;
  await room.save();

  // Clear any existing timer
  if (roomTimers.has(roomId)) {
    clearTimeout(roomTimers.get(roomId));
  }

  // Emit battle start
  io.to(roomId).emit('battle-start', {
    startTime,
    duration: room.duration,
    problem: room.problem
      ? {
          _id: room.problem._id,
          title: room.problem.title,
          difficulty: room.problem.difficulty,
          description: room.problem.description,
          inputFormat: room.problem.inputFormat,
          outputFormat: room.problem.outputFormat,
          constraints: room.problem.constraints,
          sampleTestCases: room.problem.sampleTestCases,
          tags: room.problem.tags,
        }
      : null,
  });

  // Set 30-minute timeout
  const timer = setTimeout(() => {
    handleTimeUp(io, roomId);
  }, room.duration);

  roomTimers.set(roomId, timer);
  console.log(`⚔️  Battle started in room ${roomId}`);
}

async function handleTimeUp(io, roomId) {
  try {
    const room = await Room.findById(roomId);
    if (!room || room.status !== 'active') return;

    // Find best submission per player
    const submissions = await Submission.find({ roomId, isRun: false }).sort({ submittedAt: 1 });

    const playerResults = {};
    for (const p of room.players) {
      const uid = p.userId.toString();
      const playerSubs = submissions.filter((s) => s.userId.toString() === uid);
      const bestSub = playerSubs.sort((a, b) => {
        if (b.testsPassed !== a.testsPassed) return b.testsPassed - a.testsPassed;
        return a.executionTime - b.executionTime;
      })[0];
      playerResults[uid] = bestSub || null;
    }

    const p1id = room.players[0]?.userId.toString();
    const p2id = room.players[1]?.userId.toString();
    const p1sub = playerResults[p1id];
    const p2sub = playerResults[p2id];

    let winnerId = null;
    let winReason = 'Time expired';
    let isDraw = false;

    if (!p1sub && !p2sub) {
      isDraw = true;
    } else if (!p1sub) {
      winnerId = p2id;
    } else if (!p2sub) {
      winnerId = p1id;
    } else if (p1sub.testsPassed !== p2sub.testsPassed) {
      winnerId = p1sub.testsPassed > p2sub.testsPassed ? p1id : p2id;
      winReason = 'Higher test cases passed';
    } else if (p1sub.executionTime !== p2sub.executionTime) {
      winnerId = p1sub.executionTime < p2sub.executionTime ? p1id : p2id;
      winReason = 'Lower execution time';
    } else {
      isDraw = true;
      winReason = 'Tie';
    }

    await endBattle(io, roomId, {
      winnerId: isDraw ? null : winnerId,
      winReason: isDraw ? 'Draw' : winReason,
      isDraw,
      winnerUsername: isDraw
        ? null
        : room.players.find((p) => p.userId.toString() === winnerId)?.username,
    });
  } catch (err) {
    console.error('handleTimeUp error:', err);
  }
}

async function endBattle(io, roomId, { winnerId, winnerUsername, winReason, isDraw, winnerSubmission } = {}) {
  try {
    const room = await Room.findById(roomId);
    if (!room || room.status === 'finished') return;

    // Clear timer
    if (roomTimers.has(roomId)) {
      clearTimeout(roomTimers.get(roomId));
      roomTimers.delete(roomId);
    }

    const endTime = new Date();
    room.status = 'finished';
    room.endTime = endTime;
    room.winnerId = winnerId || null;
    room.winReason = winReason;
    await room.save();

    // Update user stats
    const p1 = room.players[0];
    const p2 = room.players[1];

    if (p1 && p2) {
      const isP1Winner = winnerId && p1.userId.toString() === winnerId.toString();
      const isP2Winner = winnerId && p2.userId.toString() === winnerId.toString();

      const p1User = await User.findById(p1.userId);
      if (p1User) {
        p1User.stats.battles += 1;
        if (isDraw) {
          p1User.stats.winStreak = 0;
        } else if (isP1Winner) {
          p1User.stats.wins += 1;
          p1User.stats.winStreak = (p1User.stats.winStreak || 0) + 1;
        } else {
          p1User.stats.losses += 1;
          p1User.stats.winStreak = 0;
        }
        await p1User.save();
      }

      const p2User = await User.findById(p2.userId);
      if (p2User) {
        p2User.stats.battles += 1;
        if (isDraw) {
          p2User.stats.winStreak = 0;
        } else if (isP2Winner) {
          p2User.stats.wins += 1;
          p2User.stats.winStreak = (p2User.stats.winStreak || 0) + 1;
        } else {
          p2User.stats.losses += 1;
          p2User.stats.winStreak = 0;
        }
        await p2User.save();
      }

      // Get best submissions for battle record
      const submissions = await Submission.find({ roomId, isRun: false }).sort({ submittedAt: 1 });
      const getPlayerBest = (uid) => {
        const subs = submissions.filter((s) => s.userId.toString() === uid.toString());
        const accepted = subs.find((s) => s.verdict === 'Accepted');
        if (accepted) return accepted;
        return subs.sort((a, b) => b.testsPassed - a.testsPassed)[0] || null;
      };

      const p1Best = getPlayerBest(p1.userId);
      const p2Best = getPlayerBest(p2.userId);

      await Battle.create({
        roomId,
        problemId: room.problem,
        player1: {
          userId: p1.userId,
          username: p1.username,
          submissionId: p1Best?._id,
          verdict: p1Best?.verdict || 'No submission',
          testsPassed: p1Best?.testsPassed || 0,
          executionTime: p1Best?.executionTime || 0,
          submittedAt: p1Best?.submittedAt,
        },
        player2: {
          userId: p2.userId,
          username: p2.username,
          submissionId: p2Best?._id,
          verdict: p2Best?.verdict || 'No submission',
          testsPassed: p2Best?.testsPassed || 0,
          executionTime: p2Best?.executionTime || 0,
          submittedAt: p2Best?.submittedAt,
        },
        winnerId: winnerId || null,
        winReason,
        duration: endTime - room.startTime,
        startedAt: room.startTime,
        endedAt: endTime,
        isDraw: isDraw || false,
      });
    }

    // Broadcast winner
    io.to(roomId).emit('battle-end', {
      winnerId,
      winnerUsername,
      winReason,
      isDraw: isDraw || false,
    });

    console.log(`🏆 Battle ended in room ${roomId} — Winner: ${winnerUsername || 'Draw'}`);
  } catch (err) {
    console.error('endBattle error:', err);
  }
}

async function checkBattleCompletion(io, roomId) {
  try {
    const room = await Room.findById(roomId);
    if (!room || room.status !== 'active') return;

    const submissions = await Submission.find({ roomId, isRun: false, verdict: { $ne: 'Pending' } });
    const submittedUsers = [...new Set(submissions.map((s) => s.userId.toString()))];

    // If both players have submitted (at least once each)
    if (submittedUsers.length >= 2 && room.players.length === 2) {
      const allNonAccepted = submissions.every((s) => s.verdict !== 'Accepted');
      if (allNonAccepted) {
        // Determine winner by test cases / time
        await handleTimeUp(io, roomId);
      }
    }
  } catch (err) {
    console.error('checkBattleCompletion error:', err);
  }
}

async function handlePlayerLeave(io, socket, roomId, isDisconnect = false) {
  try {
    const userId = socket.user._id.toString();
    const room = await Room.findById(roomId);
    if (!room) return;

    const playerIdx = room.players.findIndex((p) => p.userId.toString() === userId);
    if (playerIdx !== -1) {
      room.players[playerIdx].isConnected = false;
      await room.save();
    }

    socket.leave(roomId);
    socket.to(roomId).emit('player-disconnected', {
      userId,
      username: socket.user.username,
    });
  } catch (err) {
    console.error('handlePlayerLeave error:', err);
  }
}

module.exports = initSocket;
