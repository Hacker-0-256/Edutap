import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';

// Simple function to register a new user
export async function registerUser(email: string, password: string, role: string, firstName: string, lastName: string) {
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Create new user
  const user = await User.create({
    email,
    password,
    role,
    firstName,
    lastName
  });

  // Generate JWT token
  const token = jwt.sign(
    {
      userId: user._id,
      email: user.email,
      role: user.role,
      schoolId: user.schoolId,
      parentId: user.parentId
    },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );

  return {
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      schoolId: user.schoolId,
      parentId: user.parentId
    },
    token
  };
}

// Simple function to login a user
export async function loginUser(email: string, password: string) {
  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Check if user is active
  if (!user.isActive) {
    throw new Error('Account is not active');
  }

  // Compare password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  // Generate JWT token
  const token = jwt.sign(
    {
      userId: user._id,
      email: user.email,
      role: user.role,
      schoolId: user.schoolId,
      parentId: user.parentId
    },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );

  return {
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      schoolId: user.schoolId,
      parentId: user.parentId
    },
    token
  };
}

// Simple function to verify JWT token
export function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}
