// src/routes/v1/index.ts
import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);

// Default route for v1
router.get('/', (req, res) => {
  res.json({
    message: 'API v1',
    endpoints: {
      auth: '/api/v1/auth',
      users: '/api/v1/users',
      // Will add more as we create them
      cards: '/api/v1/cards',
      attendance: '/api/v1/attendance',
      transactions: '/api/v1/transactions',
      devices: '/api/v1/devices',
      classes: '/api/v1/classes'
    }
  });
});

export default router;