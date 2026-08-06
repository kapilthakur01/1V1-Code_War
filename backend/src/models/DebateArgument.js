const mongoose = require('mongoose');

const fallacySchema = new mongoose.Schema({
  type: { type: String, required: true },
  explanation: { type: String, required: true },
}, { _id: false });

const analysisSchema = new mongoose.Schema({
  claim: { type: String, default: '' },
  evidence: { type: String, default: '' },
  reasoning: { type: String, default: '' },
  strengthScore: { type: Number, min: 0, max: 100, default: 0 },
  fallacies: [fallacySchema],
}, { _id: false });

const debateArgumentSchema = new mongoose.Schema(
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
    },
    speakerType: {
      type: String,
      enum: ['user', 'ai', 'moderator'],
      required: true,
    },
    speakerName: {
      type: String,
      default: 'AI',
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      maxlength: 5000,
    },
    round: {
      type: Number,
      default: 1,
    },
    analysis: analysisSchema,
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

debateArgumentSchema.index({ debateId: 1, timestamp: 1 });

module.exports = mongoose.model('DebateArgument', debateArgumentSchema);
