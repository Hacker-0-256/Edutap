import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.middleware.js';
import {
  createMerchantController,
  getMerchantsController,
  getMerchantController,
  updateMerchantController,
  deleteMerchantController,
  getMerchantSalesController
} from '../controllers/merchant.controller.js';

const router = express.Router();

// All merchant routes require authentication
router.use(authenticateToken);

// Create merchant (admin/school staff)
router.post('/', requireRole('admin', 'school'), createMerchantController);

// Get all merchants for a school
router.get('/school/:schoolId', getMerchantsController);

// Get a single merchant
router.get('/:merchantId', getMerchantController);

// Update merchant (admin/school staff)
router.put('/:merchantId', requireRole('admin', 'school'), updateMerchantController);

// Delete (deactivate) merchant (admin/school staff)
router.delete('/:merchantId', requireRole('admin', 'school'), deleteMerchantController);

// Get merchant sales report
router.get('/:merchantId/sales', getMerchantSalesController);

export default router;


