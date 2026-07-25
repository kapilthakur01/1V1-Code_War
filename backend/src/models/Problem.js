const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
  input: { type: String, default: '' },
  expectedOutput: { type: String, required: true },
  isSample: { type: Boolean, default: false },
  explanation: { type: String, default: '' },
});

const problemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title too long'],
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      required: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    inputFormat: {
      type: String,
      required: true,
    },
    outputFormat: {
      type: String,
      required: true,
    },
    constraints: {
      type: String,
      required: true,
    },
    sampleTestCases: [testCaseSchema],
    hiddenTestCases: [testCaseSchema],
    timeLimit: {
      type: Number,
      default: 2000, // ms
    },
    memoryLimit: {
      type: Number,
      default: 256, // MB
    },
    tags: [{ type: String }],
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Problem', problemSchema);
