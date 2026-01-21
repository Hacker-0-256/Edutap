import mongoose from 'mongoose';

// Suppress Mongoose duplicate index warnings at the process level
// These warnings occur when Mongoose auto-indexes required ObjectId refs
// and we also have compound indexes - both work fine, the warning is harmless
const originalEmitWarning = process.emitWarning;
process.emitWarning = function(warning: any, type?: string, code?: string, ctor?: Function) {
  // Suppress Mongoose duplicate index warnings
  if (typeof warning === 'string' && warning.includes('Duplicate schema index')) {
    return;
  }
  if (warning && typeof warning === 'object') {
    const message = warning.message || warning.toString();
    if (message && message.includes('Duplicate schema index')) {
      return;
    }
  }
  return originalEmitWarning.call(process, warning, type, code, ctor);
};

export async function connectDatabase() {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/school-attendance';

    await mongoose.connect(mongoURI);

    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}