import express from 'express';
import { registerUser, loginUser } from '../functions/auth.js';
import { validate } from '../middleware/validation.middleware.js';
import { registerSchema, loginSchema } from '../validation/schemas.js';
import { authLimiter } from '../middleware/rateLimit.middleware.js';

const router = express.Router();

// Register a new user
router.post('/register', authLimiter, validate(registerSchema), async (req, res) => {
  try {
    const { email, password, role, firstName, lastName, schoolId, parentId } = req.body;

    // Additional role-based validation
    if (role === 'school' && !schoolId) {
      return res.status(400).json({
        success: false,
        message: 'schoolId is required for school role'
      });
    }

    if (role === 'parent' && !parentId) {
      return res.status(400).json({
        success: false,
        message: 'parentId is required for parent role'
      });
    }

    const result = await registerUser(email, password, role, firstName, lastName, schoolId, parentId);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Login user
router.post('/login', authLimiter, validate(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation is handled by Zod middleware, but keeping for clarity
    const result = await loginUser(email, password);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result
    });

  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
