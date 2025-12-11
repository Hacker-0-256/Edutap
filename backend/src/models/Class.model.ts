import mongoose, { Schema } from 'mongoose';
import { IClass } from '../interfaces';

const classSchema = new Schema<IClass>({
  className: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
  academicYear: {
    type: String,
    required: true,
  },
  
  classTeacherId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  roomId: {
    type: Schema.Types.ObjectId,
    ref: 'Classroom',
  },
  
  schedule: {
    periodTimings: [{
      period: Number,
      startTime: String,
      endTime: String,
      subject: String,
      teacherId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    }],
    breaks: [{
      name: String,
      startTime: String,
      endTime: String,
    }],
  },
  
  students: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  capacity: {
    type: Number,
    required: true,
  },
  currentStrength: {
    type: Number,
    default: 0,
  },
  
  metadata: {
    curriculum: String,
    syllabusUrl: String,
  },
}, {
  timestamps: true,
});

// Indexes
classSchema.index({ academicYear: 1, className: 1, section: 1 });
classSchema.index({ classTeacherId: 1 });
classSchema.index({ students: 1 });

// Update currentStrength before save
classSchema.pre('save', function() {
  // 'this' refers to the document being saved
  this.currentStrength = this.students.length; 
  // No next() needed for synchronous operations.
});

export const Class = mongoose.model<IClass>('Class', classSchema);