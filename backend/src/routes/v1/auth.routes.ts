// src/routes/v1/auth.routes.ts
import { Router } from 'express';
import { AuthController } from '../../controllers/auth.controller.js';

const router = Router();

// Public routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Protected routes (will add auth middleware later)
router.get('/me', AuthController.getMe);

export default router;