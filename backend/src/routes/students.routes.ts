import express from 'express';
import { Student } from '../models/student.js';
import { Parent } from '../models/parent.js';

const router = express.Router();

// Create a new student
router.post('/', async (req, res) => {
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
router.get('/', async (req, res) => {
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
router.get('/:id', async (req, res) => {
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
router.put('/:id', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
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

export default router;
