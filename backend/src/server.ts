import dotenv from 'dotenv';
import { server, io } from './app.js';
import { connectDatabase } from './database.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

// Start server
const startServer = async () => {
  try {
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