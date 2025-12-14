import express from 'express';
import {
  createSchool,
  getSchools,
  getSchool,
  updateSchool,
  deleteSchool
} from '../controllers/admin.controller.js';
import { authenticateToken, requireRole } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require admin authentication
router.use(authenticateToken);
router.use(requireRole('admin'));

// Create a new school
router.post('/', createSchool);

// Get all schools
router.get('/', getSchools);

// Get a single school
router.get('/:id', getSchool);

// Update a school
router.put('/:id', updateSchool);

// Delete (deactivate) a school
router.delete('/:id', deleteSchool);

export default router;