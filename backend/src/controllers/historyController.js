const Battle = require('../models/Battle');

// GET /api/history?page=1&limit=10
const getHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const userId = req.user._id;

    const [battles, total] = await Promise.all([
      Battle.find({
        $or: [{ 'player1.userId': userId }, { 'player2.userId': userId }],
      })
        .populate('problemId', 'title difficulty')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Battle.countDocuments({
        $or: [{ 'player1.userId': userId }, { 'player2.userId': userId }],
      }),
    ]);

    const enriched = battles.map((b) => {
      const isPlayer1 = b.player1.userId?.toString() === userId.toString();
      const me = isPlayer1 ? b.player1 : b.player2;
      const opponent = isPlayer1 ? b.player2 : b.player1;
      const won = b.winnerId?.toString() === userId.toString();

      return {
        ...b,
        myResult: me,
        opponentResult: opponent,
        outcome: b.isDraw ? 'Draw' : won ? 'Win' : 'Loss',
      };
    });

    res.json({
      battles: enriched,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        total,
        limit,
      },
    });
  } catch (err) {
    console.error('getHistory error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getHistory };
