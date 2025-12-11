// src/server.ts
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/environment.js';
import { connectDatabase } from './config/database.js';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/error.middleware.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: config.CORS_ORIGIN,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    database: dbStatus === 1 ? 'connected' : 'disconnected'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Error handling
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await connectDatabase();
    
    app.listen(config.PORT, () => {
      console.log(`
🚀 Server Started!
📍 Port: ${config.PORT}
🌍 Environment: ${config.NODE_ENV}
🗄️ Database: ${mongoose.connection.name}
🔗 API: http://localhost:${config.PORT}/api/v1
      `);
    });
  } catch (error: any) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;