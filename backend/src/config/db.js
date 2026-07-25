const mongoose = require('mongoose');

let _memServer = null;

const connectDB = async () => {
  // Already connected — don't reconnect
  if (mongoose.connection.readyState === 1) {
    return;
  }

  let uri = process.env.MONGODB_URI;

  // Try connecting to the provided URI first
  if (uri && !uri.includes('localhost') && !uri.includes('127.0.0.1')) {
    try {
      const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
      console.log(`✅ MongoDB connected: ${conn.connection.host}`);
      return;
    } catch (err) {
      console.error('❌ MongoDB connection error:', err.message);
      throw err;
    }
  }

  // Try local MongoDB first
  if (uri) {
    try {
      const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
      console.log(`✅ MongoDB connected: ${conn.connection.host}`);
      return;
    } catch (_) {
      console.warn('⚠️  Could not connect to local MongoDB — starting in-memory MongoDB...');
    }
  }

  // Fallback to in-memory server
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');

    if (!_memServer) {
      _memServer = await MongoMemoryServer.create();
    }
    const memUri = _memServer.getUri();
    console.log('🗄️  Using in-memory MongoDB (data is ephemeral)');

    const conn = await mongoose.connect(memUri, { serverSelectionTimeoutMS: 10000 });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (memErr) {
    console.error('❌ mongodb-memory-server failed:', memErr.message);
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
