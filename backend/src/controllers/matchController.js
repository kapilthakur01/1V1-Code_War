const Room = require('../models/Room');
const Problem = require('../models/Problem');

// In-memory matchmaking queue: [{ userId, username, socketId, timestamp, timeoutHandle }]
const matchQueue = [];

// Reference to Socket.IO instance (set by initMatchController)
let _io = null;

const MATCH_TIMEOUT_MS = 2 * 60 * 1000; // 2 minutes

/**
 * Call this once from server.js after Socket.IO is ready
 */
function initMatchController(io) {
  _io = io;
}

/**
 * Remove a user from the queue and clear their timeout timer.
 */
function removeFromQueue(userId) {
  const idx = matchQueue.findIndex((e) => e.userId === userId);
  if (idx !== -1) {
    const entry = matchQueue[idx];
    if (entry.timeoutHandle) clearTimeout(entry.timeoutHandle);
    matchQueue.splice(idx, 1);
    return true;
  }
  return false;
}

// POST /api/match/find
const findMatch = async (req, res) => {
  try {
    const { socketId } = req.body;
    const userId = req.user._id.toString();
    const username = req.user.username;

    // Remove any existing entry for this user (reset timer)
    removeFromQueue(userId);

    // Check if another player is waiting
    const opponent = matchQueue.shift();

    if (opponent) {
      // Clear opponent's timeout since they're now matched
      if (opponent.timeoutHandle) clearTimeout(opponent.timeoutHandle);

      // Create a room for the match
      const problem = await Problem.aggregate([
        { $match: { isActive: true } },
        { $sample: { size: 1 } },
      ]);

      if (!problem.length) {
        // Put opponent back with a new timeout
        addToQueue(opponent.userId, opponent.username, opponent.socketId);
        return res.status(503).json({ message: 'No problems available. Please contact admin.' });
      }

      const room = await Room.create({
        type: 'public',
        status: 'waiting',
        players: [
          {
            userId: opponent.userId,
            username: opponent.username,
            socketId: opponent.socketId,
            isConnected: true,
          },
          {
            userId,
            username,
            socketId: socketId || '',
            isConnected: true,
          },
        ],
        problem: problem[0]._id,
      });

      const roomId = room._id.toString();

      // Notify both players via socket
      if (_io) {
        // Notify the waiting player (opponent)
        if (opponent.socketId) {
          _io.to(opponent.socketId).emit('matched', {
            roomId,
            roomCode: room.roomCode,
            opponentUsername: username,
          });
        }
        // Notify the current player via their socketId
        if (socketId) {
          _io.to(socketId).emit('matched', {
            roomId,
            roomCode: room.roomCode,
            opponentUsername: opponent.username,
          });
        }
      }

      return res.json({
        matched: true,
        roomId,
        roomCode: room.roomCode,
        opponentUsername: opponent.username,
      });
    } else {
      // Add to queue with 2-minute timeout
      addToQueue(userId, username, socketId);
      return res.json({ matched: false, message: 'Added to matchmaking queue' });
    }
  } catch (err) {
    console.error('findMatch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Add a user to the matchmaking queue with a 2-minute timeout.
 * After 2 minutes, the user is removed and notified via socket.
 */
function addToQueue(userId, username, socketId) {
  const timeoutHandle = setTimeout(() => {
    const removed = removeFromQueue(userId);
    if (removed) {
      console.log(`⏰ Matchmaking timeout for ${username}`);
      if (_io && socketId) {
        _io.to(socketId).emit('match-timeout', {
          message: 'No opponent found within 2 minutes. Please try again.',
        });
      }
    }
  }, MATCH_TIMEOUT_MS);

  matchQueue.push({
    userId,
    username,
    socketId: socketId || '',
    timestamp: Date.now(),
    timeoutHandle,
  });
}

// POST /api/match/cancel
const cancelSearch = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const removed = removeFromQueue(userId);
    res.json({ success: true, removed });
  } catch (err) {
    console.error('cancelSearch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/match/create-private
const createPrivateRoom = async (req, res) => {
  try {
    const userId = req.user._id;
    const username = req.user.username;

    const problem = await Problem.aggregate([
      { $match: { isActive: true } },
      { $sample: { size: 1 } },
    ]);

    if (!problem.length) {
      return res.status(503).json({ message: 'No problems available' });
    }

    const room = await Room.create({
      type: 'private',
      status: 'waiting',
      players: [
        {
          userId,
          username,
          isConnected: false,
        },
      ],
      problem: problem[0]._id,
    });

    res.status(201).json({
      roomId: room._id,
      roomCode: room.roomCode,
    });
  } catch (err) {
    console.error('createPrivateRoom error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/match/join-private
const joinPrivateRoom = async (req, res) => {
  try {
    const { roomCode } = req.body;
    const userId = req.user._id.toString();
    const username = req.user.username;

    if (!roomCode) {
      return res.status(400).json({ message: 'Room code is required' });
    }

    const room = await Room.findOne({ roomCode: roomCode.toUpperCase() });

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (room.status !== 'waiting') {
      return res.status(409).json({ message: 'Room is no longer available' });
    }

    if (room.players.length >= 2) {
      return res.status(409).json({ message: 'Room is full' });
    }

    // Check if user is already in the room
    const alreadyIn = room.players.some((p) => p.userId.toString() === userId);
    if (alreadyIn) {
      return res.json({ roomId: room._id, roomCode: room.roomCode });
    }

    room.players.push({ userId, username, isConnected: false });
    await room.save();

    res.json({
      roomId: room._id,
      roomCode: room.roomCode,
      opponentUsername: room.players[0].username,
    });
  } catch (err) {
    console.error('joinPrivateRoom error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Export queue for socket use
const getMatchQueue = () => matchQueue;

module.exports = { findMatch, cancelSearch, createPrivateRoom, joinPrivateRoom, getMatchQueue, initMatchController };
