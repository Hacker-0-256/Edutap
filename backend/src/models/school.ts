import mongoose from 'mongoose';

// Simple School schema
const schoolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  // School timing
  openingTime: {
    type: String,
    required: true,
    default: '08:00'
  },
  closingTime: {
    type: String,
    required: true,
    default: '15:00'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export const School = mongoose.model('School', schoolSchema);
