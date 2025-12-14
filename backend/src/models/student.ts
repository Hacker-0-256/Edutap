import mongoose from 'mongoose';

// Simple Student schema
const studentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  studentId: {
    type: String,
    required: true,
    unique: true
  },
  // RFID/NFC card UID
  cardUID: {
    type: String,
    required: true,
    unique: true
  },
  grade: {
    type: String,
    required: true
  },
  class: {
    type: String,
    required: true
  },
  // Link to parent
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parent',
    required: true
  },
  // Link to school
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export const Student = mongoose.model('Student', studentSchema);
