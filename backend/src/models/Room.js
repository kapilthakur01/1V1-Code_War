const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const playerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  socketId: { type: String },
  isReady: { type: Boolean, default: false },
  isConnected: { type: Boolean, default: false },
  isTyping: { type: Boolean, default: false },
});

const roomSchema = new mongoose.Schema(
  {
    roomCode: {
      type: String,
      unique: true,
      default: () => uuidv4().split('-')[0].toUpperCase(),
    },
    type: {
      type: String,
      enum: ['public', 'private'],
      default: 'public',
    },
    status: {
      type: String,
      enum: ['waiting', 'active', 'finished', 'cancelled'],
      default: 'waiting',
    },
    players: [playerSchema],
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem',
    },
    startTime: { type: Date },
    endTime: { type: Date },
    duration: { type: Number, default: 30 * 60 * 1000 }, // 30 min in ms
    winnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    winReason: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Room', roomSchema);
