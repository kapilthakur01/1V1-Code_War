const Problem = require('../models/Problem');
const Room = require('../models/Room');

// GET /api/problems/random
const getRandomProblem = async (req, res) => {
  try {
    const problems = await Problem.aggregate([
      { $match: { isActive: true } },
      { $sample: { size: 1 } },
      {
        $project: {
          hiddenTestCases: 0, // never expose hidden tests
        },
      },
    ]);

    if (!problems.length) {
      return res.status(404).json({ message: 'No problems available' });
    }

    res.json({ problem: problems[0] });
  } catch (err) {
    console.error('getRandomProblem error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/problems/:id
const getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id).select('-hiddenTestCases');

    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    res.json({ problem });
  } catch (err) {
    console.error('getProblemById error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getRandomProblem, getProblemById };
