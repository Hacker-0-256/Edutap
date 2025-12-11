// src/utils/apiResponse.ts
import { Response } from 'express';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}

export const successResponse = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode: number = 200
): void => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
  res.status(statusCode).json(response);
};

export const errorResponse = (
  res: Response,
  message: string,
  error?: string,
  statusCode: number = 500
): void => {
  const response: ApiResponse<null> = {
    success: false,
    message,
    error,
    timestamp: new Date().toISOString(),
  };
  res.status(statusCode).json(response);
};

export const notFoundResponse = (res: Response, message: string = 'Not found'): void => {
  errorResponse(res, message, undefined, 404);
};

export const validationErrorResponse = (res: Response, message: string = 'Validation failed'): void => {
  errorResponse(res, message, undefined, 422);
};