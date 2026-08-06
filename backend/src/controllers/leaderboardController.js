const DebateLeaderboard = require('../models/DebateLeaderboard');

/**
 * GET /api/debate-leaderboard — Global rankings
 */
exports.getLeaderboard = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const entries = await DebateLeaderboard.find()
      .sort({ score: -1, wins: -1 })
      .skip(skip)
      .limit(limit);

    const total = await DebateLeaderboard.countDocuments();

    // Find current user's rank
    let userRank = null;
    if (req.user) {
      userRank = await DebateLeaderboard.findOne({ userId: req.user._id });
    }

    res.json({
      entries,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      userRank,
    });
  } catch (err) {
    console.error('getLeaderboard error:', err);
    res.status(500).json({ message: 'Failed to get leaderboard' });
  }
};
