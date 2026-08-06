require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { Server } = require('socket.io');

const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/auth');
const matchRoutes = require('./src/routes/match');
const problemsRoutes = require('./src/routes/problems');
const submissionsRoutes = require('./src/routes/submissions');
const historyRoutes = require('./src/routes/history');
const adminRoutes = require('./src/routes/admin');
const debateRoutes = require('./src/routes/debate');
const debateRoomRoutes = require('./src/routes/debateRoom');
const debateLeaderboardRoutes = require('./src/routes/debateLeaderboard');
const debateResultsRoutes = require('./src/routes/debateResults');
const initSocket = require('./src/socket');
const initDebateSocket = require('./src/socket/debateSocket');
const { initMatchController } = require('./src/controllers/matchController');

const app = express();
const server = http.createServer(app);

// ── Socket.IO ──────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || true,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
});

// ── Middleware ─────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: process.env.FRONTEND_URL || true,
  credentials: true,
}));
app.use(express.json({ limit: '2mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Global rate limiter
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
}));

// ── Routes ─────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/problems', problemsRoutes);
app.use('/api/submissions', submissionsRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/debate', debateRoutes);
app.use('/api/debate-room', debateRoomRoutes);
app.use('/api/debate-leaderboard', debateLeaderboardRoutes);
app.use('/api/debate-result', debateResultsRoutes);

// Root route to indicate the backend is running
app.get('/', (req, res) => {
  res.json({
    message: 'CodeClash Backend is running successfully!',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', server: 'running', timestamp: new Date().toISOString() });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', server: 'running', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
  });
});

// ── Init ───────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  // Seed problems if DB is empty
  const Problem = require('./src/models/Problem');
  const count = await Problem.countDocuments();
  if (count === 0) {
    console.log('🌱 Seeding problems...');
    const seed = require('./src/seed/problems');
    await seed();
    console.log('✅ Problems seeded');
  }

  initSocket(io);
  initMatchController(io);
  initDebateSocket(io);

  server.listen(PORT, () => {
    console.log(`🚀 CodeClash backend running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('❌ Failed to connect to MongoDB:', err.message);
  process.exit(1);
});

module.exports = { app, io };
