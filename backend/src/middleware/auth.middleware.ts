import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';

// Middleware to authenticate JWT token
export function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
}

// Middleware to check if user has required role
export function requireRole(...roles: string[]) {
  return (req: any, res: any, next: any) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
}

// Middleware to check if user belongs to specific school (for school role)
export function requireSchoolAccess(req: any, res: any, next: any) {
  if (req.user.role === 'school') {
    // For school routes, ensure the schoolId matches user's schoolId
    const { schoolId } = req.params;
    if (schoolId && req.user.schoolId !== schoolId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: School mismatch'
      });
    }
  }
  next();
}

// Middleware to check if user is accessing their own parent data
export function requireParentAccess(req: any, res: any, next: any) {
  if (req.user.role === 'parent') {
    // For parent routes, ensure the parentId matches user's parentId
    const { parentId } = req.params;
    if (parentId && req.user.parentId !== parentId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Parent mismatch'
      });
    }
  }
  next();
}