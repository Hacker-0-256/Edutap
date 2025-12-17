import express from 'express';
import {
  processPaymentController,
  getTransactionHistoryController,
  getAccountBalanceController,
  getMerchantSalesController,
  refundTransactionController,
  getPaymentReceiptController
} from '../controllers/payment.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { processPaymentSchema } from '../validation/schemas.js';
import { paymentLimiter } from '../middleware/rateLimit.middleware.js';

const router = express.Router();

// Process payment (called by POS devices)
router.post('/process', paymentLimiter, validate(processPaymentSchema), processPaymentController);

// Get payment receipt (PDF)
router.get('/:transactionId/receipt', authenticateToken, getPaymentReceiptController);

// Get transaction history for a student
router.get('/student/:studentId/history', getTransactionHistoryController);

// Get account balance for a student
router.get('/student/:studentId/balance', getAccountBalanceController);

// Get merchant sales
router.get('/merchant/:merchantId/sales', getMerchantSalesController);

// Refund a transaction
router.post('/:transactionId/refund', refundTransactionController);

export default router;


