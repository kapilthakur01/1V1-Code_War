const mongoose = require('mongoose');

const debateLeaderboardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      default: 0,
      index: true,
    },
    rank: {
      type: Number,
      default: 0,
    },
    wins: {
      type: Number,
      default: 0,
    },
    losses: {
      type: Number,
      default: 0,
    },
    totalDebates: {
      type: Number,
      default: 0,
    },
    averageScore: {
      type: Number,
      default: 0,
    },
    winRate: {
      type: Number,
      default: 0,
    },
    bestCategory: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

debateLeaderboardSchema.index({ score: -1, wins: -1 });

module.exports = mongoose.model('DebateLeaderboard', debateLeaderboardSchema);
