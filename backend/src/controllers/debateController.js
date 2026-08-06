const Debate = require('../models/Debate');
const DebateArgument = require('../models/DebateArgument');
const DebateResult = require('../models/DebateResult');
const DebateLeaderboard = require('../models/DebateLeaderboard');
const User = require('../models/User');
const { generateDebateResponse, analyzeArgument, evaluateDebate } = require('../services/geminiService');

/**
 * POST /api/debate/create — Create a new AI debate
 */
exports.createDebate = async (req, res) => {
  try {
    const { topic, category, side } = req.body;
    if (!topic || !side) {
      return res.status(400).json({ message: 'Topic and side are required' });
    }

    const aiSide = side === 'support' ? 'oppose' : 'support';

    const debate = await Debate.create({
      type: 'AI_DEBATE',
      topic,
      category: category || 'Custom',
      participants: [{
        userId: req.user._id,
        side,
        username: req.user.username,
      }],
      aiSide,
      status: 'active',
      startedAt: new Date(),
    });

    // Generate AI opening statement if AI goes first (support side opens)
    if (aiSide === 'support') {
      const aiResponse = await generateDebateResponse(topic, aiSide, [], 1);
      const analysis = await analyzeArgument(aiResponse, topic, aiSide);

      await DebateArgument.create({
        debateId: debate._id,
        speakerType: 'ai',
        speakerName: 'AI Opponent',
        message: aiResponse,
        round: 1,
        analysis,
      });
    }

    res.status(201).json({ debate });
  } catch (err) {
    console.error('createDebate error:', err);
    res.status(500).json({ message: 'Failed to create debate' });
  }
};

/**
 * GET /api/debate/:id — Get debate with messages
 */
exports.getDebate = async (req, res) => {
  try {
    const debate = await Debate.findById(req.params.id);
    if (!debate) {
      return res.status(404).json({ message: 'Debate not found' });
    }

    const arguments_ = await DebateArgument.find({ debateId: debate._id })
      .sort({ timestamp: 1 });

    res.json({ debate, arguments: arguments_ });
  } catch (err) {
    console.error('getDebate error:', err);
    res.status(500).json({ message: 'Failed to get debate' });
  }
};

/**
 * POST /api/debate/:id/message — Send a message in AI debate
 */
exports.sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const debate = await Debate.findById(req.params.id);
    if (!debate) {
      return res.status(404).json({ message: 'Debate not found' });
    }
    if (debate.status !== 'active') {
      return res.status(400).json({ message: 'Debate is not active' });
    }

    // Get participant info
    const participant = debate.participants.find(
      p => p.userId.toString() === req.user._id.toString()
    );
    if (!participant) {
      return res.status(403).json({ message: 'Not a participant' });
    }

    // Analyze user's argument
    const userAnalysis = await analyzeArgument(message, debate.topic, participant.side);

    // Save user's argument
    const userArg = await DebateArgument.create({
      debateId: debate._id,
      userId: req.user._id,
      speakerType: 'user',
      speakerName: req.user.username,
      message: message.trim(),
      round: debate.rounds.current,
      analysis: userAnalysis,
    });

    // Get conversation history
    const history = await DebateArgument.find({ debateId: debate._id })
      .sort({ timestamp: 1 })
      .select('speakerType message');

    // Generate AI response
    const aiResponse = await generateDebateResponse(
      debate.topic,
      debate.aiSide,
      history,
      debate.rounds.current
    );
    const aiAnalysis = await analyzeArgument(aiResponse, debate.topic, debate.aiSide);

    const aiArg = await DebateArgument.create({
      debateId: debate._id,
      speakerType: 'ai',
      speakerName: 'AI Opponent',
      message: aiResponse,
      round: debate.rounds.current,
      analysis: aiAnalysis,
    });

    // Check if we should advance the round
    const totalMessages = await DebateArgument.countDocuments({
      debateId: debate._id,
      speakerType: { $in: ['user', 'ai'] },
    });

    // Advance round every 2 exchanges (4 messages)
    const newRound = Math.floor(totalMessages / 4) + 1;
    if (newRound !== debate.rounds.current && newRound <= debate.rounds.total) {
      debate.rounds.current = newRound;
      await debate.save();
    }

    res.json({
      userArgument: userArg,
      aiArgument: aiArg,
      currentRound: debate.rounds.current,
      totalRounds: debate.rounds.total,
    });
  } catch (err) {
    console.error('sendMessage error:', err);
    res.status(500).json({ message: 'Failed to send message' });
  }
};

/**
 * POST /api/debate/:id/end — End debate and generate results
 */
exports.endDebate = async (req, res) => {
  try {
    const debate = await Debate.findById(req.params.id);
    if (!debate) {
      return res.status(404).json({ message: 'Debate not found' });
    }

    const participant = debate.participants.find(
      p => p.userId.toString() === req.user._id.toString()
    );
    if (!participant) {
      return res.status(403).json({ message: 'Not a participant' });
    }

    // Get all arguments
    const allArgs = await DebateArgument.find({ debateId: debate._id })
      .sort({ timestamp: 1 });

    // Evaluate debate
    const evaluation = await evaluateDebate(allArgs, debate.topic, participant.side);

    // Save result
    const result = await DebateResult.create({
      debateId: debate._id,
      userId: req.user._id,
      scores: evaluation.scores,
      overallScore: evaluation.overallScore,
      feedback: evaluation.feedback,
      strengths: evaluation.strengths,
      weaknesses: evaluation.weaknesses,
      improvementPlan: evaluation.improvementPlan,
      fallaciesDetected: evaluation.fallaciesDetected || [],
    });

    // Update debate status
    debate.status = 'completed';
    debate.endedAt = new Date();
    debate.duration = Math.round((debate.endedAt - debate.startedAt) / 1000);

    // Determine winner based on score
    if (evaluation.overallScore >= 70) {
      debate.winner = req.user._id;
      debate.winnerLabel = 'user';
    } else if (evaluation.overallScore < 50) {
      debate.winnerLabel = 'ai';
    } else {
      debate.winnerLabel = 'draw';
    }
    await debate.save();

    // Update user stats
    const user = await User.findById(req.user._id);
    user.debateStats.totalDebates = (user.debateStats.totalDebates || 0) + 1;
    if (debate.winnerLabel === 'user') {
      user.debateStats.wins = (user.debateStats.wins || 0) + 1;
    } else if (debate.winnerLabel === 'ai') {
      user.debateStats.losses = (user.debateStats.losses || 0) + 1;
    } else {
      user.debateStats.draws = (user.debateStats.draws || 0) + 1;
    }

    // Update average score
    const allResults = await DebateResult.find({ userId: req.user._id });
    const avgScore = allResults.reduce((sum, r) => sum + r.overallScore, 0) / allResults.length;
    user.debateStats.averageScore = Math.round(avgScore);

    // Update skills
    const scores = evaluation.scores;
    user.debateSkills.logic = Math.round((user.debateSkills.logic + scores.logic) / 2);
    user.debateSkills.communication = Math.round((user.debateSkills.communication + scores.communication) / 2);
    user.debateSkills.confidence = Math.round((user.debateSkills.confidence + scores.confidence) / 2);
    user.debateSkills.criticalThinking = Math.round((user.debateSkills.criticalThinking + scores.criticalThinking) / 2);
    user.debateSkills.evidence = Math.round((user.debateSkills.evidence + scores.evidence) / 2);
    await user.save();

    // Update leaderboard
    await DebateLeaderboard.findOneAndUpdate(
      { userId: req.user._id },
      {
        userId: req.user._id,
        username: req.user.username,
        score: user.debateStats.averageScore,
        wins: user.debateStats.wins,
        totalDebates: user.debateStats.totalDebates,
        averageScore: user.debateStats.averageScore,
        winRate: user.debateStats.totalDebates > 0
          ? Math.round((user.debateStats.wins / user.debateStats.totalDebates) * 100)
          : 0,
      },
      { upsert: true, new: true }
    );

    // Recalculate ranks
    const allEntries = await DebateLeaderboard.find().sort({ score: -1, wins: -1 });
    for (let i = 0; i < allEntries.length; i++) {
      allEntries[i].rank = i + 1;
      await allEntries[i].save();
    }

    res.json({ result, debate });
  } catch (err) {
    console.error('endDebate error:', err);
    res.status(500).json({ message: 'Failed to end debate' });
  }
};

/**
 * GET /api/debate/history — User's debate history
 */
exports.getDebateHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const debates = await Debate.find({
      'participants.userId': req.user._id,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Debate.countDocuments({
      'participants.userId': req.user._id,
    });

    // Get results for each debate
    const debatesWithResults = await Promise.all(
      debates.map(async (d) => {
        const result = await DebateResult.findOne({
          debateId: d._id,
          userId: req.user._id,
        });
        return { ...d.toObject(), result };
      })
    );

    res.json({
      debates: debatesWithResults,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error('getDebateHistory error:', err);
    res.status(500).json({ message: 'Failed to get history' });
  }
};
