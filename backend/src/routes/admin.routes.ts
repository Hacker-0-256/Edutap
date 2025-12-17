import express from 'express';
import {
  getSystemLogs,
  getLogStats,
  cleanupLogs,
  getUsers,
  getAllTransactions,
  getSalesAnalytics,
  getAccountSummaries,
  getRevenueReports
} from '../controllers/admin.controller.js';
import { authenticateToken, requireRole } from '../middleware/auth.middleware.js';
import { apiLimiter } from '../middleware/rateLimit.middleware.js';

const router = express.Router();

// All routes require admin authentication
router.use(authenticateToken);
router.use(requireRole('admin'));
router.use(apiLimiter); // Apply rate limiting to all admin routes

// Log management routes
router.get('/logs', getSystemLogs);
router.get('/logs/stats', getLogStats);
router.delete('/logs/cleanup', cleanupLogs);

// User management
router.get('/users', getUsers);

// Transaction dashboard
router.get('/transactions', getAllTransactions);

// Sales analytics
router.get('/sales', getSalesAnalytics);

// Account summaries
router.get('/accounts', getAccountSummaries);

// Revenue reports
router.get('/revenue', getRevenueReports);

export default router;