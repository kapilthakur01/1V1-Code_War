const mongoose = require('mongoose');

const battleSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem',
      required: true,
    },
    player1: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      username: String,
      submissionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Submission' },
      verdict: String,
      testsPassed: Number,
      executionTime: Number,
      submittedAt: Date,
    },
    player2: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      username: String,
      submissionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Submission' },
      verdict: String,
      testsPassed: Number,
      executionTime: Number,
      submittedAt: Date,
    },
    winnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    winReason: { type: String },
    duration: { type: Number }, // actual battle duration in ms
    startedAt: { type: Date },
    endedAt: { type: Date },
    isDraw: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Battle', battleSchema);
