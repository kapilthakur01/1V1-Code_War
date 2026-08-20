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

// ── Allowed Origins ────────────────────────────────────────────────────────
// Primary source: FRONTEND_URL env var (comma-separated list of origins).
// Hardcoded fallback: the known Render production frontend URL so CORS never
// breaks even if the env var is not set on the Render dashboard.
const PRODUCTION_FRONTEND = 'https://onev1-code-war-5.onrender.com';

const rawFrontendUrl = process.env.FRONTEND_URL || '';
const envOrigins = rawFrontendUrl
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

// Merge env origins with hardcoded production origin (deduplicated)
const allowedOrigins = Array.from(new Set([...envOrigins, PRODUCTION_FRONTEND]));

console.log('🌐 CORS allowed origins:', allowedOrigins);
console.log('🔑 FRONTEND_URL env var:', rawFrontendUrl || '(not set — using hardcoded fallback)');

const corsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server / curl / mobile app requests (no Origin header)
    if (!origin) return callback(null, true);
    // Always allow localhost for local development
    if (/^https?:\/\/localhost(:\d+)?$/.test(origin)) return callback(null, true);
    // Check against the allowed list
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // Block everything else
    console.warn(`[CORS] ❌ Blocked origin: ${origin}`);
    return callback(new Error(`CORS policy: origin '${origin}' is not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
};

// ── App & Server ───────────────────────────────────────────────────────────
const app = express();
const server = http.createServer(app);

// ── Socket.IO ──────────────────────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: corsOptions.origin,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
});

// ── Middleware (ORDER IS CRITICAL) ─────────────────────────────────────────

// 1. Handle ALL OPTIONS preflight requests immediately — BEFORE helmet,
//    rate-limiter, or any route handler. This is the #1 cause of CORS
//    failures: the OPTIONS request hits a 404 before CORS headers are added.
app.options('*', cors(corsOptions));

// 2. Helmet (security headers) — after preflight so it doesn't interfere
app.use(helmet({ contentSecurityPolicy: false }));

// 3. CORS for all other request methods
app.use(cors(corsOptions));

// 4. Body parser
app.use(express.json({ limit: '2mb' }));

// 5. Logger
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// 6. Global rate limiter (applied only to /api routes)
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
}));

// ── Routes ─────────────────────────────────────────────────────────────────
// Route mounts: server mounts at /api/auth → router handles /login, /signup, /me
// Final endpoints:  POST /api/auth/login  ✅
//                   POST /api/auth/signup ✅
//                   GET  /api/auth/me     ✅
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

// ── Utility Endpoints ───────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    message: 'CodeClash Backend is running successfully!',
    environment: process.env.NODE_ENV || 'development',
    allowedOrigins,
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', server: 'running', timestamp: new Date().toISOString() });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', server: 'running', timestamp: new Date().toISOString() });
});

// ── 404 Handler ────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.path}` });
});

// ── Error Handler ──────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
  });
});

// ── Start Server ───────────────────────────────────────────────────────────
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

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 CodeClash backend running on port ${PORT}`);
    console.log(`📡 Listening on 0.0.0.0:${PORT}`);
  });
}).catch((err) => {
  console.error('❌ Failed to connect to MongoDB:', err.message);
  process.exit(1);
});

module.exports = { app, io };
