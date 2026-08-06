const DebateResult = require('../models/DebateResult');
const User = require('../models/User');
const { generateCoachAdvice } = require('../services/geminiService');

/**
 * GET /api/debate-result/:debateId — Get result for a debate
 */
exports.getResult = async (req, res) => {
  try {
    const result = await DebateResult.findOne({
      debateId: req.params.debateId,
      userId: req.user._id,
    });

    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }

    res.json({ result });
  } catch (err) {
    console.error('getResult error:', err);
    res.status(500).json({ message: 'Failed to get result' });
  }
};

/**
 * GET /api/debate-coach — Personal coaching data
 */
exports.getCoachData = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // Get recent results
    const recentResults = await DebateResult.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10);

    const stats = {
      totalDebates: user.debateStats.totalDebates,
      wins: user.debateStats.wins,
      losses: user.debateStats.losses,
      draws: user.debateStats.draws,
      averageScore: user.debateStats.averageScore,
      skills: user.debateSkills,
    };

    // Generate AI coaching advice
    let advice;
    if (recentResults.length > 0) {
      advice = await generateCoachAdvice(stats, recentResults);
    } else {
      advice = {
        roadmap: 'Start your first debate to get personalized coaching advice!',
        focusAreas: ['Getting started', 'Building confidence'],
        tips: ['Start with a topic you know well', 'Practice forming clear arguments', 'Listen to counter-arguments carefully'],
        nextChallenge: 'Try debating "Should AI replace teachers?"',
      };
    }

    res.json({
      stats,
      recentResults,
      advice,
    });
  } catch (err) {
    console.error('getCoachData error:', err);
    res.status(500).json({ message: 'Failed to get coach data' });
  }
};
