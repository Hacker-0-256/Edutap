import express from 'express';
import {
  getProfile,
  updateProfile,
  getChildren,
  getChildAttendance,
  getAttendanceSummary
} from '../controllers/parent.controller.js';
import { authenticateToken, requireRole } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require parent authentication
router.use(authenticateToken);
router.use(requireRole('parent'));

// Profile routes
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Children routes
router.get('/children', getChildren);
router.get('/children/:studentId/attendance', getChildAttendance);

// Attendance summary
router.get('/attendance-summary', getAttendanceSummary);

export default router;