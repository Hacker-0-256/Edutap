import dotenv from 'dotenv';
import { server, io } from './app.js';
import { connectDatabase } from './database.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

// Validate required environment variables
function validateEnvironment() {
  const required = ['JWT_SECRET'];
  const missing: string[] = [];

  required.forEach((key) => {
    if (!process.env[key] || process.env[key] === 'your-secret-key-change-this-in-production') {
      missing.push(key);
    }
  });

  if (missing.length > 0) {
    console.error('❌ Missing or invalid required environment variables:');
    missing.forEach((key) => {
      console.error(`   - ${key}`);
    });
    console.error('\n💡 Please set these in your .env file before starting the server.');
    console.error('💡 See .env.example for reference.\n');
    process.exit(1);
  }
}

// Start server
const startServer = async () => {
  try {
    // Validate environment variables
    validateEnvironment();

    // Connect to database
    await connectDatabase();

    // Start the server with Socket.io
    server.listen(PORT, () => {
      console.log(`
🚀 IoT School Attendance System Started!
📍 Port: ${PORT}
🗄️ Database: Connected
🔗 API: http://localhost:${PORT}/api
🔌 WebSocket: ws://localhost:${PORT}
📡 IoT Devices: Ready for connections
      `);
    });
  } catch (error: any) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});