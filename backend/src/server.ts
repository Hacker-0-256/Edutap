import dotenv from 'dotenv';
import { execSync } from 'child_process';
import { server, io } from './app.js';
import { connectDatabase } from './database.js';

// Load environment variables
// Load from backend/.env (current directory when running from backend/)
dotenv.config({ path: '.env' });

const PORT = process.env.PORT || 5001;

// Validate required environment variables
function validateEnvironment() {
  const required = ['JWT_SECRET'];
  const missing: string[] = [];

  required.forEach((key) => {
    const value = process.env[key];
    // Check if missing or matches any placeholder variant
    if (!value || 
        value === 'your-secret-key-change-this-in-production' ||
        value === 'your-super-secret-jwt-key-change-this-in-production' ||
        value.trim().length < 10) {
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
    const serverInstance = server.listen(PORT, () => {
      console.log(`
🚀 IoT School Attendance System Started!
📍 Port: ${PORT}
🗄️ Database: Connected
🔗 API: http://localhost:${PORT}/api
🔌 WebSocket: ws://localhost:${PORT}
📡 IoT Devices: Ready for connections
      `);
    });

    serverInstance.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use.`);
        console.error(`💡 Please change the PORT in your .env file or kill the process using port ${PORT}`);
        console.error(`💡 To kill: lsof -ti:${PORT} | xargs kill -9`);
        process.exit(1);
      } else {
        throw err;
      }
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