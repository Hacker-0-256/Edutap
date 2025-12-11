import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { User } from '../models/User.model.js';
import { successResponse } from '../utils/apiResponse.js';
import { BadRequestError, UnauthorizedError } from '../utils/apiError.js';
import { config } from '../config/environment.js';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, phone, password, role, firstName, lastName } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new BadRequestError('User already exists');
      }

      const user = await User.create({
        email,
        phone,
        password,
        role,
        profile: { firstName, lastName },
      });

      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        config.JWT_SECRET,
        { expiresIn: config.JWT_EXPIRE } as SignOptions
      );

      successResponse(res, 'User registered successfully', {
        user: {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
          fullName: `${user.profile.firstName} ${user.profile.lastName}`,
        },
        token,
      }, 201);
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email }).select('+password');
      if (!user) throw new UnauthorizedError('Invalid credentials');

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) throw new UnauthorizedError('Invalid credentials');

      if (user.status !== 'active') {
        throw new UnauthorizedError('Account is not active');
      }

      user.lastLogin = new Date();
      await user.save({ validateBeforeSave: false });

      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        config.JWT_SECRET,
        { expiresIn: config.JWT_EXPIRE } as SignOptions
      );

      successResponse(res, 'Login successful', {
        user: {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
          fullName: `${user.profile.firstName} ${user.profile.lastName}`,
        },
        token,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) throw new UnauthorizedError('Not authenticated');

      const user = await User.findById(userId);
      if (!user) throw new UnauthorizedError('User not found');

      successResponse(res, 'User retrieved successfully', {
        user: {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
          profile: user.profile,
          studentDetails: user.studentDetails,
          parentDetails: user.parentDetails,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}