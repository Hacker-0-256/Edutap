import mongoose from 'mongoose';

// Simple Parent schema
const parentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true
  },
  address: {
    type: String
  },
  // SMS notification preference
  receiveSMS: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export const Parent = mongoose.model('Parent', parentSchema);
