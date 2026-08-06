const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  side: { type: String, enum: ['support', 'oppose'], required: true },
  username: { type: String, required: true },
}, { _id: false });

const debateSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['AI_DEBATE', 'USER_DEBATE'],
      required: true,
    },
    topic: {
      type: String,
      required: [true, 'Debate topic is required'],
      trim: true,
      maxlength: 500,
    },
    category: {
      type: String,
      enum: ['Technology', 'Education', 'Science', 'Environment', 'Healthcare', 'Social Issues', 'Business', 'Custom'],
      default: 'Custom',
    },
    participants: [participantSchema],
    aiSide: {
      type: String,
      enum: ['support', 'oppose'],
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'abandoned'],
      default: 'active',
    },
    rounds: {
      total: { type: Number, default: 5 },
      current: { type: Number, default: 1 },
      timePerRound: { type: Number, default: 180 }, // seconds
    },
    duration: {
      type: Number, // total seconds
      default: 0,
    },
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    winnerLabel: {
      type: String, // 'user', 'ai', 'draw', or username
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    endedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

debateSchema.index({ 'participants.userId': 1, status: 1 });
debateSchema.index({ type: 1, createdAt: -1 });

module.exports = mongoose.model('Debate', debateSchema);
