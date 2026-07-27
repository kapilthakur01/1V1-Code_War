const mongoose = require('mongoose');

let _memServer = null;

const connectDB = async () => {
  // Already connected — don't reconnect
  if (mongoose.connection.readyState === 1) {
    return;
  }

  const uri = process.env.MONGODB_URI;
  const isProduction = process.env.NODE_ENV === 'production';

  // ── Production: MONGODB_URI is mandatory, no fallbacks ──
  if (isProduction) {
    if (!uri) {
      console.error('❌ MONGODB_URI is not set! Cannot start without a database in production.');
      console.error('   Set MONGODB_URI in your Render environment variables.');
      process.exit(1);
    }
    try {
      const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
      console.log(`✅ MongoDB connected: ${conn.connection.host}`);
      return;
    } catch (err) {
      console.error('❌ MongoDB connection error:', err.message);
      throw err;
    }
  }

  // ── Development: Try provided URI first ──
  if (uri) {
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: uri.includes('localhost') || uri.includes('127.0.0.1') ? 3000 : 10000,
      });
      console.log(`✅ MongoDB connected: ${conn.connection.host}`);
      return;
    } catch (err) {
      console.warn(`⚠️  Could not connect to MongoDB (${err.message})`);
      console.warn('   Falling back to in-memory MongoDB...');
    }
  }

  // ── Development fallback: in-memory MongoDB ──
  try {
    // Dynamic require — this package is in devDependencies only
    // It will NOT be installed in production (npm install --production)
    const { MongoMemoryServer } = require('mongodb-memory-server');

    if (!_memServer) {
      _memServer = await MongoMemoryServer.create();
    }
    const memUri = _memServer.getUri();
    console.log('🗄️  Using in-memory MongoDB (data is ephemeral)');

    const conn = await mongoose.connect(memUri, { serverSelectionTimeoutMS: 10000 });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (memErr) {
    console.error('❌ mongodb-memory-server is not available.');
    console.error('   Install it with: npm install -D mongodb-memory-server');
    console.error('   Or set MONGODB_URI to connect to a real MongoDB instance.');
    throw memErr;
  }
};

// Cleanup on exit
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  if (_memServer) await _memServer.stop();
  process.exit(0);
});

module.exports = connectDB;
