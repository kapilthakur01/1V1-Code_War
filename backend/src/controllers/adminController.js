const Problem = require('../models/Problem');

// GET /api/admin/problems
const getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find().sort({ createdAt: -1 });
    res.json({ problems });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/admin/problems
const createProblem = async (req, res) => {
  try {
    const {
      title,
      difficulty,
      description,
      inputFormat,
      outputFormat,
      constraints,
      sampleTestCases,
      hiddenTestCases,
      tags,
      timeLimit,
      memoryLimit,
    } = req.body;

    const problem = await Problem.create({
      title,
      difficulty,
      description,
      inputFormat,
      outputFormat,
      constraints,
      sampleTestCases: sampleTestCases || [],
      hiddenTestCases: hiddenTestCases || [],
      tags: tags || [],
      timeLimit: timeLimit || 2000,
      memoryLimit: memoryLimit || 256,
      createdBy: req.user._id,
    });

    res.status(201).json({ problem });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: Object.values(err.errors).map((e) => e.message).join('. ') });
    }
    console.error('createProblem error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/admin/problems/:id
const updateProblem = async (req, res) => {
  try {
    const problem = await Problem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!problem) return res.status(404).json({ message: 'Problem not found' });
    res.json({ problem });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: Object.values(err.errors).map((e) => e.message).join('. ') });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/admin/problems/:id
const deleteProblem = async (req, res) => {
  try {
    const problem = await Problem.findByIdAndDelete(req.params.id);
    if (!problem) return res.status(404).json({ message: 'Problem not found' });
    res.json({ message: 'Problem deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAllProblems, createProblem, updateProblem, deleteProblem };
