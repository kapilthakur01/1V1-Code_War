const DebateRoom = require('../models/DebateRoom');
const Debate = require('../models/Debate');
const DebateArgument = require('../models/DebateArgument');
const DebateResult = require('../models/DebateResult');
const DebateLeaderboard = require('../models/DebateLeaderboard');
const User = require('../models/User');
const { analyzeArgument, moderateDebate, evaluateDebate } = require('../services/geminiService');

function initDebateSocket(io) {
  const debateNsp = io.of('/debate');

  debateNsp.on('connection', (socket) => {
    console.log('Debate socket connected:', socket.id);

    // Join a debate room
    socket.on('debate:join-room', async ({ roomCode, userId, username }) => {
      try {
        socket.join(roomCode);
        socket.roomCode = roomCode;
        socket.userId = userId;
        socket.username = username;

        const room = await DebateRoom.findOne({ roomCode: roomCode.toUpperCase() });
        if (room) {
          // Update connected status
          const participant = room.participants.find(
            p => p.userId.toString() === userId
          );
          if (participant) {
            participant.connected = true;
            await room.save();
          }

          debateNsp.to(roomCode).emit('debate:room-update', { room });
          debateNsp.to(roomCode).emit('debate:user-joined', { userId, username });
        }
      } catch (err) {
        console.error('debate:join-room error:', err);
      }
    });

    // Ready toggle
    socket.on('debate:ready', async ({ roomCode, userId }) => {
      try {
        const room = await DebateRoom.findOne({ roomCode: roomCode.toUpperCase() });
        if (!room) return;

        const participant = room.participants.find(
          p => p.userId.toString() === userId
        );
        if (participant) {
          participant.ready = !participant.ready;
          await room.save();
        }

        // Check if all ready
        const allReady = room.participants.length >= 2 &&
          room.participants.every(p => p.ready);

        if (allReady) {
          // Create the debate
          const debate = await Debate.create({
            type: 'USER_DEBATE',
            topic: room.topic,
            category: room.category,
            participants: room.participants.map(p => ({
              userId: p.userId,
              side: p.side,
              username: p.username,
            })),
            status: 'active',
            rounds: {
              total: room.rounds.total,
              timePerRound: room.rounds.timePerRound,
              current: 1,
            },
            startedAt: new Date(),
          });

          room.status = 'active';
          room.debateId = debate._id;
          await room.save();

          debateNsp.to(roomCode).emit('debate:started', {
            debateId: debate._id,
            room,
          });
        } else {
          debateNsp.to(roomCode).emit('debate:room-update', { room });
        }
      } catch (err) {
        console.error('debate:ready error:', err);
      }
    });

    // Send message in live debate
    socket.on('debate:send-message', async ({ roomCode, debateId, userId, username, message, side }) => {
      try {
        // Analyze the argument
        const debate = await Debate.findById(debateId);
        if (!debate || debate.status !== 'active') return;

        const analysis = await analyzeArgument(message, debate.topic, side);

        const arg = await DebateArgument.create({
          debateId,
          userId,
          speakerType: 'user',
          speakerName: username,
          message,
          round: debate.rounds.current,
          analysis,
        });

        // Broadcast to room
        debateNsp.to(roomCode).emit('debate:new-message', {
          argument: arg,
        });

        // Check if AI moderation is needed (every 4 messages)
        const msgCount = await DebateArgument.countDocuments({ debateId });
        if (msgCount % 4 === 0) {
          const recentMsgs = await DebateArgument.find({ debateId })
            .sort({ timestamp: -1 })
            .limit(4);

          const moderation = await moderateDebate(recentMsgs.reverse(), debate.topic);
          if (moderation.shouldIntervene) {
            const modArg = await DebateArgument.create({
              debateId,
              speakerType: 'moderator',
              speakerName: 'AI Moderator',
              message: moderation.intervention,
              round: debate.rounds.current,
            });

            debateNsp.to(roomCode).emit('debate:moderator-message', {
              argument: modArg,
              reason: moderation.reason,
            });
          }
        }
      } catch (err) {
        console.error('debate:send-message error:', err);
      }
    });

    // Typing indicator
    socket.on('debate:typing', ({ roomCode, userId, username, isTyping }) => {
      socket.to(roomCode).emit('debate:user-typing', { userId, username, isTyping });
    });

    // Change round
    socket.on('debate:next-round', async ({ roomCode, debateId }) => {
      try {
        const debate = await Debate.findById(debateId);
        if (!debate) return;

        if (debate.rounds.current < debate.rounds.total) {
          debate.rounds.current += 1;
          await debate.save();
          debateNsp.to(roomCode).emit('debate:round-changed', {
            currentRound: debate.rounds.current,
            totalRounds: debate.rounds.total,
          });
        }
      } catch (err) {
        console.error('debate:next-round error:', err);
      }
    });

    // End live debate
    socket.on('debate:end', async ({ roomCode, debateId }) => {
      try {
        const debate = await Debate.findById(debateId);
        if (!debate || debate.status !== 'active') return;

        const allArgs = await DebateArgument.find({ debateId }).sort({ timestamp: 1 });

        // Evaluate each participant
        for (const participant of debate.participants) {
          const evaluation = await evaluateDebate(allArgs, debate.topic, participant.side);

          await DebateResult.create({
            debateId,
            userId: participant.userId,
            scores: evaluation.scores,
            overallScore: evaluation.overallScore,
            feedback: evaluation.feedback,
            strengths: evaluation.strengths,
            weaknesses: evaluation.weaknesses,
            improvementPlan: evaluation.improvementPlan,
            fallaciesDetected: evaluation.fallaciesDetected || [],
          });

          // Update user stats
          const user = await User.findById(participant.userId);
          if (user) {
            user.debateStats.totalDebates = (user.debateStats.totalDebates || 0) + 1;
            const allResults = await DebateResult.find({ userId: participant.userId });
            const avgScore = allResults.reduce((s, r) => s + r.overallScore, 0) / allResults.length;
            user.debateStats.averageScore = Math.round(avgScore);
            user.debateSkills.logic = Math.round((user.debateSkills.logic + evaluation.scores.logic) / 2);
            user.debateSkills.communication = Math.round((user.debateSkills.communication + evaluation.scores.communication) / 2);
            user.debateSkills.confidence = Math.round((user.debateSkills.confidence + evaluation.scores.confidence) / 2);
            user.debateSkills.criticalThinking = Math.round((user.debateSkills.criticalThinking + evaluation.scores.criticalThinking) / 2);
            user.debateSkills.evidence = Math.round((user.debateSkills.evidence + evaluation.scores.evidence) / 2);
            await user.save();

            // Update leaderboard
            await DebateLeaderboard.findOneAndUpdate(
              { userId: participant.userId },
              {
                userId: participant.userId,
                username: user.username,
                score: user.debateStats.averageScore,
                wins: user.debateStats.wins,
                totalDebates: user.debateStats.totalDebates,
                averageScore: user.debateStats.averageScore,
                winRate: user.debateStats.totalDebates > 0
                  ? Math.round((user.debateStats.wins / user.debateStats.totalDebates) * 100) : 0,
              },
              { upsert: true, new: true }
            );
          }
        }

        debate.status = 'completed';
        debate.endedAt = new Date();
        debate.duration = Math.round((debate.endedAt - debate.startedAt) / 1000);
        await debate.save();

        const room = await DebateRoom.findOne({ roomCode: roomCode.toUpperCase() });
        if (room) {
          room.status = 'completed';
          await room.save();
        }

        debateNsp.to(roomCode).emit('debate:ended', { debateId });
      } catch (err) {
        console.error('debate:end error:', err);
      }
    });

    // Disconnect
    socket.on('disconnect', async () => {
      if (socket.roomCode) {
        debateNsp.to(socket.roomCode).emit('debate:user-disconnected', {
          userId: socket.userId,
          username: socket.username,
        });
      }
    });
  });
}

module.exports = initDebateSocket;
