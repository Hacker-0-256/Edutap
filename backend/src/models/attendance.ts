import mongoose from 'mongoose';

// Simple Attendance schema
const attendanceSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
    // Note: Mongoose auto-indexes required ObjectId refs
    // We also have a compound index, which is fine - both will work
  },
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true
  },
  // Type of attendance event (only check-in for arrival tracking)
  type: {
    type: String,
    enum: ['check-in'],
    default: 'check-in',
    required: true
  },
  // When the student tapped the card
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  },
  // Date in YYYY-MM-DD format for easy querying
  date: {
    type: String,
    required: true
  },
  // Device/gate information
  deviceId: {
    type: String,
    required: true
  },
  deviceLocation: {
    type: String,
    required: true
  },
  // SMS notification status
  smsNotificationSent: {
    type: Boolean,
    default: false
  },
  smsNotificationError: {
    type: String
  }
}, {
  timestamps: true,
  autoIndex: true
});

// Index for faster queries
// Note: studentId is auto-indexed by Mongoose (required ObjectId ref)
// We create compound index which includes studentId, so the single index is redundant but harmless
attendanceSchema.index({ studentId: 1, date: 1 }, { background: true });
attendanceSchema.index({ date: 1 });

export const Attendance = mongoose.model('Attendance', attendanceSchema);
