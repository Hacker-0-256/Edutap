import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Import routes
import authRoutes from './routes/auth.routes.js';
import attendanceRoutes from './routes/attendance.routes.js';
import studentsRoutes from './routes/students.routes.js';
import parentsRoutes from './routes/parents.routes.js';
import devicesRoutes from './routes/devices.routes.js';
import logsRoutes from './routes/logs.routes.js';
import schoolsRoutes from './routes/schools.routes.js';
import schoolRoutes from './routes/school.routes.js';
import parentRoutes from './routes/parent.routes.js';
import adminRoutes from './routes/admin.routes.js';
// Payment system routes
import paymentsRoutes from './routes/payments.routes.js';
import topupRoutes from './routes/topup.routes.js';
import accountsRoutes from './routes/accounts.routes.js';
import cardsRoutes from './routes/cards.routes.js';
import merchantsRoutes from './routes/merchants.routes.js';
import cardTapRoutes from './routes/cardTap.routes.js';
import exportRoutes from './routes/export.routes.js';

// Set up Socket.io for attendance notifications
import { setSocketIO } from './functions/attendance.js';
import { apiLimiter } from './middleware/rateLimit.middleware.js';

// Create Express app
const app = express();

// Create HTTP server for Socket.io
const server = createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Set Socket.io for attendance notifications
setSocketIO(io);

// CORS Configuration
const corsOptions = {
  origin: process.env.CORS_ORIGINS 
    ? process.env.CORS_ORIGINS.split(',').map((origin: string) => origin.trim())
    : (process.env.NODE_ENV === 'production' ? [] : ['http://localhost:3000', 'http://localhost:5173']),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (student photos)
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Apply general rate limiting to all API routes
app.use('/api', apiLimiter);

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/parents', parentsRoutes);
app.use('/api/devices', devicesRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/schools', schoolsRoutes);
app.use('/api/school', schoolRoutes);
app.use('/api/parent', parentRoutes);
app.use('/api/admin', adminRoutes);
// Payment system routes
app.use('/api/payments', paymentsRoutes);
app.use('/api/topup', topupRoutes);
app.use('/api/accounts', accountsRoutes);
app.use('/api/cards', cardsRoutes);
app.use('/api/merchants', merchantsRoutes);
app.use('/api/card', cardTapRoutes); // Unified card tap handler
app.use('/api/reports/export', exportRoutes); // Export routes

// Root route - API information
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'EduTap API Server',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api',
      documentation: 'See API_DOCUMENTATION.md for full API reference'
    },
    availableRoutes: [
      '/api/auth - Authentication endpoints',
      '/api/attendance - Attendance management',
      '/api/students - Student management',
      '/api/parents - Parent management',
      '/api/devices - IoT device management',
      '/api/payments - Payment processing',
      '/api/topup - Top-up management',
      '/api/accounts - Account management',
      '/api/cards - Card management',
      '/api/merchants - Merchant management',
      '/api/admin - Admin dashboard',
      '/api/reports/export - Report exports'
    ],
    timestamp: new Date().toISOString()
  });
});

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
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', error.message);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Socket.io real-time features
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Join school room for real-time updates
  socket.on('join-school', (schoolId) => {
    socket.join(`school-${schoolId}`);
    console.log(`Client ${socket.id} joined school-${schoolId}`);
  });

  // Join device room for device-specific updates
  socket.on('join-device', (deviceId) => {
    socket.join(`device-${deviceId}`);
    console.log(`Client ${socket.id} joined device-${deviceId}`);
  });

  // Handle device heartbeat
  socket.on('device-heartbeat', (data) => {
    // Broadcast device status to school room
    socket.to(`school-${data.schoolId}`).emit('device-status-update', {
      deviceId: data.deviceId,
      status: 'online',
      lastSeen: new Date(),
      metrics: data.metrics
    });
  });

  // Handle attendance event
  socket.on('attendance-recorded', (data) => {
    // Broadcast to school room
    socket.to(`school-${data.schoolId}`).emit('new-attendance', {
      studentName: data.studentName,
      type: data.type,
      timestamp: data.timestamp,
      location: data.location
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Export both app and server for different use cases
export { app, server, io };
export default app;