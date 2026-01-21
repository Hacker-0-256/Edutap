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
import { uploadPhoto, getPhotoUrl, deletePhotoFile } from '../middleware/upload.middleware.js';

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

// Upload/Update student photo
router.post('/:id/photo', requireRole('admin', 'school'), uploadPhoto.single('photo'), async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      // Delete uploaded file if student not found
      if (req.file) {
        deletePhotoFile(req.file.filename);
      }
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No photo file provided'
      });
    }

    // Delete old photo if exists
    if (student.photo) {
      deletePhotoFile(student.photo);
    }

    // Update student with new photo
    student.photo = req.file.filename;
    student.photoUpdatedAt = new Date();
    await student.save();

    res.status(200).json({
      success: true,
      message: 'Student photo uploaded successfully',
      data: {
        studentId: student._id,
        photo: getPhotoUrl(student.photo),
        photoUpdatedAt: student.photoUpdatedAt
      }
    });

  } catch (error: any) {
    // Delete uploaded file on error
    if (req.file) {
      deletePhotoFile(req.file.filename);
    }
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Delete student photo
router.delete('/:id/photo', requireRole('admin', 'school'), async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    if (!student.photo) {
      return res.status(400).json({
        success: false,
        message: 'Student has no photo to delete'
      });
    }

    // Delete photo file
    deletePhotoFile(student.photo);

    // Remove photo reference from student
    student.photo = null;
    student.photoUpdatedAt = undefined;
    await student.save();

    res.status(200).json({
      success: true,
      message: 'Student photo deleted successfully'
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

export default router;
