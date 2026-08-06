const mongoose = require('mongoose');

const scoresSchema = new mongoose.Schema({
  logic: { type: Number, min: 0, max: 100, default: 0 },
  evidence: { type: Number, min: 0, max: 100, default: 0 },
  communication: { type: Number, min: 0, max: 100, default: 0 },
  confidence: { type: Number, min: 0, max: 100, default: 0 },
  criticalThinking: { type: Number, min: 0, max: 100, default: 0 },
  persuasion: { type: Number, min: 0, max: 100, default: 0 },
}, { _id: false });

const debateResultSchema = new mongoose.Schema(
  {
    debateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Debate',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    scores: {
      type: scoresSchema,
      default: () => ({}),
    },
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    feedback: {
      type: String,
      default: '',
    },
    strengths: [{
      type: String,
    }],
    weaknesses: [{
      type: String,
    }],
    improvementPlan: {
      type: String,
      default: '',
    },
    fallaciesDetected: [{
      type: { type: String },
      count: { type: Number, default: 0 },
    }],
  },
  { timestamps: true }
);

debateResultSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('DebateResult', debateResultSchema);
