import express from 'express';
import {
  createStudent,
  getStudents,
  getStudent,
  updateStudent,
  deleteStudent,
  createParent,
  getParents,
  getParent,
  updateParent,
  deleteParent,
  getTodayAttendance,
  getAttendanceReport,
  getAttendanceStats,
  getStudentAttendanceHistory
} from '../controllers/school.controller.js';
import { authenticateToken, requireRole, requireSchoolAccess } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require school authentication
router.use(authenticateToken);
router.use(requireRole('school'));

// Student routes
router.post('/students', createStudent);
router.get('/:schoolId/students', requireSchoolAccess, getStudents);
router.get('/students/:id', getStudent);
router.put('/students/:id', updateStudent);
router.delete('/students/:id', deleteStudent);

// Parent routes
router.post('/parents', createParent);
router.get('/:schoolId/parents', requireSchoolAccess, getParents);
router.get('/parents/:id', getParent);
router.put('/parents/:id', updateParent);
router.delete('/parents/:id', deleteParent);

// Attendance routes
router.get('/:schoolId/attendance/today', requireSchoolAccess, getTodayAttendance);
router.get('/:schoolId/attendance/report', requireSchoolAccess, getAttendanceReport);
router.get('/:schoolId/attendance/stats', requireSchoolAccess, getAttendanceStats);
router.get('/:schoolId/students/:studentId/attendance', requireSchoolAccess, getStudentAttendanceHistory);

export default router;