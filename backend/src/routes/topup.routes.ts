import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.middleware.js';
import {
  initiateTopUpController,
  processTopUpController,
  createManualTopUpController,
  failTopUpController,
  getTopUpHistoryController,
  getTopUpStatusController
} from '../controllers/topup.controller.js';
import { validate } from '../middleware/validation.middleware.js';
import { createManualTopUpSchema, initiateTopUpSchema, processTopUpSchema } from '../validation/schemas.js';
import { paymentLimiter } from '../middleware/rateLimit.middleware.js';

const router = express.Router();

// All top-up routes require authentication
router.use(authenticateToken);

// Create and process manual top-up (admin/school staff only)
// This is the main endpoint for manual top-ups when parents give cash
router.post('/manual', requireRole('admin', 'school'), paymentLimiter, validate(createManualTopUpSchema), createManualTopUpController);

// Initiate top-up (parent role - optional, for future use)
router.post('/initiate', requireRole('parent'), paymentLimiter, validate(initiateTopUpSchema), initiateTopUpController);

// Process top-up (admin/school staff - supports both manual and payment gateway)
// paymentReference is optional for manual processing
router.post('/:topUpId/process', requireRole('admin', 'school'), paymentLimiter, validate(processTopUpSchema), processTopUpController);

// Mark top-up as failed (admin/school staff)
router.post('/:topUpId/fail', requireRole('admin', 'school'), failTopUpController);

// Get top-up history
router.get('/history', getTopUpHistoryController);

// Get top-up status
router.get('/:topUpId/status', getTopUpStatusController);

export default router;


