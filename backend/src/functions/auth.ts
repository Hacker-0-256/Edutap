import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';

// Validate password strength
function validatePasswordStrength(password: string): { valid: boolean; error?: string } {
  // Minimum length: 8 characters
  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters long' };
  }

  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one uppercase letter' };
  }

  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one lowercase letter' };
  }

  // Check for at least one number
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one number' };
  }

  // Check for at least one special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one special character' };
  }

  return { valid: true };
}

// Simple function to register a new user
export async function registerUser(
  email: string,
  password: string,
  role: string,
  firstName: string,
  lastName: string,
  schoolId?: string,
  parentId?: string
) {
  // Validate password strength
  const passwordValidation = validatePasswordStrength(password);
  if (!passwordValidation.valid) {
    throw new Error(passwordValidation.error);
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Validate role-specific requirements
  if (role === 'school' && !schoolId) {
    throw new Error('schoolId is required for school role');
  }

  if (role === 'parent' && !parentId) {
    throw new Error('parentId is required for parent role');
  }

  // Validate schoolId exists if provided
  if (schoolId) {
    const { School } = await import('../models/school.js');
    const school = await School.findById(schoolId);
    if (!school) {
      throw new Error('School not found');
    }
  }

  // Validate parentId exists if provided
  if (parentId) {
    const { Parent } = await import('../models/parent.js');
    const parent = await Parent.findById(parentId);
    if (!parent) {
      throw new Error('Parent not found');
    }
  }

  // Create new user
  const user = await User.create({
    email,
    password,
    role,
    firstName,
    lastName,
    schoolId: schoolId || undefined,
    parentId: parentId || undefined
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
