// src/controllers/user.controller.ts
import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User.model.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { ApiError, NotFoundError, ForbiddenError } from '../utils/apiError.js';

export class UserController {
  // Get all users (with filtering)
  static async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { role, status, page = 1, limit = 10 } = req.query;
      
      const filter: any = {};
      if (role) filter.role = role;
      if (status) filter.status = status;

      const skip = (Number(page) - 1) * Number(limit);

      const [users, total] = await Promise.all([
        User.find(filter)
          .skip(skip)
          .limit(Number(limit))
          .select('-password -refreshToken')
          .sort({ createdAt: -1 }),
        User.countDocuments(filter)
      ]);

      successResponse(res, 'Users retrieved successfully', {
        users,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get user by ID
  static async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const user = await User.findById(id).select('-password -refreshToken');
      
      if (!user) {
        throw new NotFoundError('User not found');
      }

      successResponse(res, 'User retrieved successfully', { user });
    } catch (error) {
      next(error);
    }
  }

  // Update user
  static async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Remove sensitive fields
      delete updateData.password;
      delete updateData.email;
      delete updateData.role;

      const user = await User.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).select('-password -refreshToken');

      if (!user) {
        throw new NotFoundError('User not found');
      }

      successResponse(res, 'User updated successfully', { user });
    } catch (error) {
      next(error);
    }
  }

  // Delete user (soft delete)
  static async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const user = await User.findByIdAndUpdate(
        id,
        { status: 'inactive' },
        { new: true }
      ).select('-password -refreshToken');

      if (!user) {
        throw new NotFoundError('User not found');
      }

      successResponse(res, 'User deactivated successfully', { user });
    } catch (error) {
      next(error);
    }
  }

  // Get students by class
  static async getStudentsByClass(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { classId } = req.params;
      
      const students = await User.find({
        role: 'student',
        'studentDetails.classId': classId,
        status: 'active'
      }).select('-password -refreshToken');

      successResponse(res, 'Students retrieved successfully', { students });
    } catch (error) {
      next(error);
    }
  }

  // Get parent's children
  static async getParentChildren(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parentId = (req as any).user?.id;
      
      const parent = await User.findById(parentId).populate({
        path: 'parentDetails.children',
        select: '-password -refreshToken',
        match: { status: 'active' }
      });

      if (!parent || !parent.parentDetails) {
        throw new NotFoundError('Parent not found or has no children');
      }

      successResponse(res, 'Children retrieved successfully', {
        children: parent.parentDetails.children
      });
    } catch (error) {
      next(error);
    }
  }
}