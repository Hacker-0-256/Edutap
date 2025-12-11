import mongoose, { Schema } from 'mongoose';
import { IAttendance } from '../interfaces';
import { AttendanceType } from '../types/enums';

const attendanceSchema = new Schema<IAttendance>({
  eventType: {
    type: String,
    enum: Object.values(AttendanceType),
    required: true,
  },
  cardId: {
    type: Schema.Types.ObjectId,
    ref: 'Card',
    required: true,
  },
  studentId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  deviceId: {
    type: Schema.Types.ObjectId,
    ref: 'Device',
    required: true,
  },
  
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
  location: {
    gate: {
      type: String,
      required: true,
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
      },
      coordinates: {
        type: [Number],
      },
    },
  },
  
  automated: {
    type: Boolean,
    default: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  
  metadata: {
    readerSignal: Number,
    temperature: Number,
  },
  
  // Partitioning fields
  date: {
    type: String, // Format: YYYY-MM-DD
    index: true,
  },
  hour: {
    type: Number, // 0-23
    index: true,
  },
}, {
  timestamps: true,
});

// Indexes
attendanceSchema.index({ studentId: 1, timestamp: -1 });
attendanceSchema.index({ cardId: 1, timestamp: -1 });
attendanceSchema.index({ deviceId: 1, timestamp: -1 });
attendanceSchema.index({ date: 1, eventType: 1 });
attendanceSchema.index({ 'location.coordinates': '2dsphere' });

// Set date and hour before save
attendanceSchema.pre('save', function(next) {
  const dateObj = new Date(this.timestamp);
  this.date = dateObj.toISOString().split('T')[0];
  this.hour = dateObj.getHours();
  // next();
});

export const Attendance = mongoose.model<IAttendance>('Attendance', attendanceSchema);