import express from 'express';
import {
  getSystemLogs,
  getLogStats,
  cleanupLogs,
  getUsers
} from '../controllers/admin.controller.js';
import { authenticateToken, requireRole } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require admin authentication
router.use(authenticateToken);
router.use(requireRole('admin'));

// Log management routes
router.get('/logs', getSystemLogs);
router.get('/logs/stats', getLogStats);
router.delete('/logs/cleanup', cleanupLogs);

// User management
router.get('/users', getUsers);

export default router;