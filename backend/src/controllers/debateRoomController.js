const DebateRoom = require('../models/DebateRoom');
const Debate = require('../models/Debate');
const { v4: uuidv4 } = require('uuid');

/**
 * POST /api/debate-room/create — Create a live debate room
 */
exports.createRoom = async (req, res) => {
  try {
    const { topic, category, side, rounds, timePerRound } = req.body;
    if (!topic) {
      return res.status(400).json({ message: 'Topic is required' });
    }

    const roomCode = uuidv4().substring(0, 6).toUpperCase();

    const room = await DebateRoom.create({
      roomCode,
      hostUser: req.user._id,
      participants: [{
        userId: req.user._id,
        username: req.user.username,
        side: side || 'support',
        ready: false,
        connected: true,
      }],
      topic,
      category: category || 'Custom',
      status: 'waiting',
      rounds: {
        total: rounds || 5,
        timePerRound: timePerRound || 180,
      },
    });

    res.status(201).json({ room });
  } catch (err) {
    console.error('createRoom error:', err);
    res.status(500).json({ message: 'Failed to create room' });
  }
};

/**
 * POST /api/debate-room/join — Join a room by code
 */
exports.joinRoom = async (req, res) => {
  try {
    const { roomCode } = req.body;
    if (!roomCode) {
      return res.status(400).json({ message: 'Room code is required' });
    }

    const room = await DebateRoom.findOne({
      roomCode: roomCode.toUpperCase(),
      status: 'waiting',
    });

    if (!room) {
      return res.status(404).json({ message: 'Room not found or already started' });
    }

    // Check if already joined
    const alreadyIn = room.participants.some(
      p => p.userId.toString() === req.user._id.toString()
    );
    if (alreadyIn) {
      return res.json({ room });
    }

    if (room.participants.length >= room.maxParticipants) {
      return res.status(400).json({ message: 'Room is full' });
    }

    // Determine opposite side
    const hostSide = room.participants[0]?.side || 'support';
    const joinerSide = hostSide === 'support' ? 'oppose' : 'support';

    room.participants.push({
      userId: req.user._id,
      username: req.user.username,
      side: joinerSide,
      ready: false,
      connected: true,
    });
    await room.save();

    res.json({ room });
  } catch (err) {
    console.error('joinRoom error:', err);
    res.status(500).json({ message: 'Failed to join room' });
  }
};

/**
 * GET /api/debate-room/:code — Get room by code
 */
exports.getRoom = async (req, res) => {
  try {
    const room = await DebateRoom.findOne({
      roomCode: req.params.code.toUpperCase(),
    });

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json({ room });
  } catch (err) {
    console.error('getRoom error:', err);
    res.status(500).json({ message: 'Failed to get room' });
  }
};
