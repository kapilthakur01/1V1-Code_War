const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
  testCaseIndex: Number,
  passed: Boolean,
  executionTime: Number, // ms
  input: String,
  expectedOutput: String,
  actualOutput: String,
  isHidden: Boolean,
});

const submissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
    },
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem',
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      enum: ['cpp17', 'java17'],
      required: true,
    },
    verdict: {
      type: String,
      enum: [
        'Accepted',
        'Wrong Answer',
        'Compilation Error',
        'Runtime Error',
        'Time Limit Exceeded',
        'Memory Limit Exceeded',
        'Pending',
      ],
      default: 'Pending',
    },
    testsPassed: { type: Number, default: 0 },
    totalTests: { type: Number, default: 0 },
    executionTime: { type: Number, default: 0 }, // ms
    memoryUsed: { type: Number, default: 0 }, // MB
    compileError: { type: String, default: '' },
    testResults: [testResultSchema],
    submittedAt: { type: Date, default: Date.now },
    isRun: { type: Boolean, default: false }, // true for "Run" button, false for "Submit"
    customInput: { type: String, default: '' },
    customOutput: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Submission', submissionSchema);
