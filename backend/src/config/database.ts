// src/config/database.ts
import mongoose from 'mongoose';
import { config } from './environment.js';

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error: any) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.disconnect();
};