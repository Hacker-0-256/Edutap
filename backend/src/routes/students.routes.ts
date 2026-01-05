import express from 'express';
import { Student } from '../models/student.js';
import { Parent } from '../models/parent.js';
import {
  registerStudentWithParentController,
  registerMultipleStudentsController
} from '../controllers/studentRegistration.controller.js';
import { authenticateToken, requireRole } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { registerStudentWithParentSchema } from '../validation/schemas.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Register student with parent/guardian (recommended - creates parent if needed)
router.post('/register', requireRole('admin', 'school'), validate(registerStudentWithParentSchema), registerStudentWithParentController);

// Register multiple students (siblings) with same parent
router.post('/register-multiple', requireRole('admin', 'school'), registerMultipleStudentsController);

// Create a new student (legacy - requires existing parentId)
router.post('/', requireRole('admin', 'school'), async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      studentId, 
      cardUID, 
      grade, 
      class: className,
      parentId,
      schoolId 
    } = req.body;

    // Simple validation
    if (!firstName || !lastName || !studentId || !cardUID || !grade || !className || !parentId || !schoolId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if parent exists
    const parent = await Parent.findById(parentId);
    if (!parent) {
      return res.status(404).json({
        success: false,
        message: 'Parent not found'
      });
    }

    // Create student
    const student = await Student.create({
      firstName,
      lastName,
      studentId,
      cardUID,
      grade,
      class: className,
      parentId,
      schoolId
    });

    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: student
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Get all students
router.get('/', requireRole('admin', 'school'), async (req, res) => {
  try {
    const students = await Student.find({ isActive: true })
      .populate('parentId', 'firstName lastName phone email')
      .populate('schoolId', 'name');

    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Get a single student by ID
router.get('/:id', requireRole('admin', 'school', 'parent'), async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('parentId')
      .populate('schoolId');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Update a student
router.put('/:id', requireRole('admin', 'school'), async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: student
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Delete (deactivate) a student
router.delete('/:id', requireRole('admin', 'school'), async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student deactivated successfully'
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Add or update cardUID for a student
router.put('/:id/card', requireRole('admin', 'school'), async (req, res) => {
  try {
    const { cardUID } = req.body;
    if (!cardUID) {
      return res.status(400).json({
        success: false,
        message: 'cardUID is required'
      });
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { cardUID },
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Card assigned to student successfully',
      data: student
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
