const mongoose = require('mongoose');

const roomParticipantSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  side: { type: String, enum: ['support', 'oppose'] },
  ready: { type: Boolean, default: false },
  connected: { type: Boolean, default: true },
}, { _id: false });

const debateRoomSchema = new mongoose.Schema(
  {
    roomCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      index: true,
    },
    hostUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    participants: [roomParticipantSchema],
    topic: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    category: {
      type: String,
      enum: ['Technology', 'Education', 'Science', 'Environment', 'Healthcare', 'Social Issues', 'Business', 'Custom'],
      default: 'Custom',
    },
    status: {
      type: String,
      enum: ['waiting', 'active', 'completed', 'abandoned'],
      default: 'waiting',
    },
    debateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Debate',
    },
    rounds: {
      total: { type: Number, default: 5 },
      timePerRound: { type: Number, default: 180 },
    },
    maxParticipants: {
      type: Number,
      default: 2,
    },
  },
  { timestamps: true }
);

// Auto-expire waiting rooms after 1 hour
debateRoomSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600, partialFilterExpression: { status: 'waiting' } });

module.exports = mongoose.model('DebateRoom', debateRoomSchema);
