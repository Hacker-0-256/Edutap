// src/middlewares/error.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError.js';
import mongoose from 'mongoose';

export const errorHandler = (
  error: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let err = error;

  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Handle Mongoose errors
  if (err instanceof mongoose.Error.CastError) {
    err = new ApiError(400, `Invalid ${err.path}: ${err.value}`);
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(err.errors).map((e) => e.message);
    err = new ApiError(400, `Validation failed: ${messages.join(', ')}`);
  }

  // Handle duplicate key error
  if ((err as any).code === 11000) {
    const field = Object.keys((err as any).keyPattern)[0];
    err = new ApiError(409, `${field} already exists`);
  }

  const statusCode = (err as ApiError).statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    timestamp: new Date().toISOString(),
  });
};