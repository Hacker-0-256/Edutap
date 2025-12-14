import express from 'express';
import { registerUser, loginUser } from '../functions/auth.js';

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, role, firstName, lastName } = req.body;

    // Simple validation
    if (!email || !password || !role || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const result = await registerUser(email, password, role, firstName, lastName);

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
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Simple validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

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
