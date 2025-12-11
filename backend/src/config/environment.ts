// src/config/environment.ts
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000'),
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/iot_school',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
};