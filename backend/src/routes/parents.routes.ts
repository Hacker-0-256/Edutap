import express from 'express';
import { Parent } from '../models/parent.js';
import { School } from '../models/school.js';
import { authenticateToken, requireRole } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { createParentSchema } from '../validation/schemas.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Create a new parent
router.post('/', requireRole('admin', 'school'), validate(createParentSchema), async (req, res) => {
  try {
    const { firstName, lastName, phone, email, address, receiveSMS, schoolId } = req.body;

    // Validate school exists
    const school = await School.findById(schoolId);
    if (!school) {
      return res.status(404).json({
        success: false,
        message: 'School not found'
      });
    }

    // Check if parent with this phone already exists
    const existingParent = await Parent.findOne({ phone });
    if (existingParent) {
      return res.status(400).json({
        success: false,
        message: 'Parent with this phone number already exists',
        data: existingParent
      });
    }

    const parent = await Parent.create({
      firstName,
      lastName,
      phone,
      email: email || '',
      address,
      schoolId,
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
router.get('/', requireRole('admin', 'school'), async (req, res) => {
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
router.get('/:id', requireRole('admin', 'school', 'parent'), async (req, res) => {
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
router.put('/:id', requireRole('admin', 'school', 'parent'), async (req, res) => {
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
