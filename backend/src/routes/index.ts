// src/routes/index.ts
import { Router } from 'express';
import v1Routes from './v1/index.js';

const router = Router();

router.use('/v1', v1Routes);

// API root
router.get('/', (req, res) => {
  res.json({
    message: 'IoT School Management System API',
    version: '1.0.0',
    documentation: 'Coming soon...',
    currentVersion: '/api/v1'
  });
});

export default router;