import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import {
  getBalanceController,
  getTransactionsController,
  adjustBalanceController,
  getSchoolAccountSummaryController
} from '../controllers/account.controller.js';

const router = express.Router();

// All account routes require authentication
router.use(authenticateToken);

// Get account balance for a student
router.get('/student/:studentId/balance', getBalanceController);

// Get transactions for a student account
router.get('/student/:studentId/transactions', getTransactionsController);

// Manual balance adjustment (admin/school staff)
router.post('/student/:studentId/adjust', adjustBalanceController);

// Get account summary for a school (admin/school staff)
router.get('/school/:schoolId/summary', getSchoolAccountSummaryController);

export default router;


