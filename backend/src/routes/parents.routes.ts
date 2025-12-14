import express from 'express';
import { Parent } from '../models/parent.js';

const router = express.Router();

// Create a new parent
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, phone, email, address, receiveSMS } = req.body;

    // Simple validation
    if (!firstName || !lastName || !phone || !email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide firstName, lastName, phone, and email'
      });
    }

    const parent = await Parent.create({
      firstName,
      lastName,
      phone,
      email,
      address,
      receiveSMS: receiveSMS !== undefined ? receiveSMS : true
    });

    res.status(201).json({
      success: true,
      message: 'Parent created successfully',
      data: parent
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Get all parents
router.get('/', async (req, res) => {
  try {
    const parents = await Parent.find({ isActive: true });

    res.status(200).json({
      success: true,
      count: parents.length,
      data: parents
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Get a single parent by ID
router.get('/:id', async (req, res) => {
  try {
    const parent = await Parent.findById(req.params.id);

    if (!parent) {
      return res.status(404).json({
        success: false,
        message: 'Parent not found'
      });
    }

    res.status(200).json({
      success: true,
      data: parent
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Update a parent
router.put('/:id', async (req, res) => {
  try {
    const parent = await Parent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!parent) {
      return res.status(404).json({
        success: false,
        message: 'Parent not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Parent updated successfully',
      data: parent
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
