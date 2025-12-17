import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.middleware.js';
import {
  deactivateCardController,
  reactivateCardController,
  replaceCardController,
  getCardStatusController,
  validateCardController
} from '../controllers/card.controller.js';

const router = express.Router();

// Deactivate card (admin/school staff)
router.post('/:cardUID/deactivate', authenticateToken, requireRole('admin', 'school'), deactivateCardController);

// Reactivate card (admin/school staff)
router.post('/:cardUID/reactivate', authenticateToken, requireRole('admin', 'school'), reactivateCardController);

// Replace card (admin/school staff)
router.post('/:cardUID/replace', authenticateToken, requireRole('admin', 'school'), replaceCardController);

// Get card status (public - for device validation)
router.get('/:cardUID/status', getCardStatusController);

// Validate card (for devices)
router.post('/validate', validateCardController);

export default router;


