import express from 'express';
import { cardTapController, getDeviceActionController } from '../controllers/cardTap.controller.js';
import { validate } from '../middleware/validation.middleware.js';
import { cardTapSchema } from '../validation/schemas.js';
import { cardTapLimiter } from '../middleware/rateLimit.middleware.js';

const router = express.Router();

// Unified card tap endpoint - automatically routes to attendance or payment
router.post('/tap', cardTapLimiter, validate(cardTapSchema), cardTapController);

// Get device action type
router.get('/device/:deviceId/action', getDeviceActionController);

export default router;


