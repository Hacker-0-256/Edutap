import express from 'express';
import {
  exportAttendanceReport,
  exportTransactionReport,
  exportSalesReport
} from '../controllers/export.controller.js';
import { authenticateToken, requireRole } from '../middleware/auth.middleware.js';
import { apiLimiter } from '../middleware/rateLimit.middleware.js';

const router = express.Router();

// All export routes require authentication
router.use(authenticateToken);
router.use(apiLimiter);

// Export attendance report
// GET /api/reports/export/attendance?format=csv|pdf&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&schoolId=xxx
router.get('/attendance', requireRole('admin', 'school'), exportAttendanceReport);

// Export transaction report
// GET /api/reports/export/transactions?format=csv|pdf&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&schoolId=xxx&type=purchase|top-up
router.get('/transactions', requireRole('admin', 'school'), exportTransactionReport);

// Export sales report
// GET /api/reports/export/sales?format=csv&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&schoolId=xxx&merchantId=xxx
router.get('/sales', requireRole('admin', 'school'), exportSalesReport);

export default router;

