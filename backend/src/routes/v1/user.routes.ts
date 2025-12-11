// src/routes/v1/user.routes.ts
import { Router } from 'express';
import { UserController } from '../../controllers/user.controller.js';

const router = Router();

// Public/Admin routes
router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);
router.put('/:id', UserController.updateUser);
router.delete('/:id', UserController.deleteUser);

// Special routes
router.get('/class/:classId/students', UserController.getStudentsByClass);
router.get('/parent/children', UserController.getParentChildren);

export default router;