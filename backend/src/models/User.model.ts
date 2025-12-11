import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../interfaces';
import { UserRole } from '../types/enums';

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    required: true,
  },

  // Student details
  studentDetails: {
    rollNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    classId: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
    },
    section: String,
    admissionDate: Date,
    currentStatus: {
      type: String,
      enum: ['active', 'graduated', 'transferred'],
      default: 'active',
    },
  },

  // Parent details
  parentDetails: {
    children: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    notificationPreferences: {
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      email: { type: Boolean, default: true },
    },
  },

  // Staff/Admin details
  employeeId: {
    type: String,
    unique: true,
    sparse: true,
  },
  department: String,

  // Profile
  profile: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: Date,
    address: String,
    photoUrl: String,
  },

  // Settings
  settings: {
    language: { type: String, default: 'en' },
    theme: { type: String, default: 'light' },
  },

  // Status
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active',
  },

  // Timestamps
  lastLogin: Date,
  passwordChangedAt: Date,
  refreshToken: String,
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'studentDetails.rollNumber': 1 });
userSchema.index({ 'parentDetails.children': 1 });
userSchema.index({ status: 1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.profile.firstName} ${this.profile.lastName}`;
});

// Hash password before saving
userSchema.pre('save', async function() {
  // If password is not modified, simply return. Mongoose proceeds.
  if (!this.isModified('password')) {
    return;
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    // When the function finishes, Mongoose proceeds.
  } catch (error: any) {
    // To handle errors, throw them. Mongoose will catch and prevent save.
    throw new Error(error);
  }
});

// Update passwordChangedAt when password changes
userSchema.pre('save', function() {
  // If the password was not modified OR the document is new, just exit.
  if (!this.isModified('password') || this.isNew) {
    return;
  }
  
  // Set the password change timestamp
  this.passwordChangedAt = new Date(Date.now() - 1000);
  
  // The function is synchronous, so Mongoose automatically proceeds upon exit.
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to check if password was changed after JWT was issued
userSchema.methods.changedPasswordAfter = function(JWTTimestamp: number): boolean {
  if (this.passwordChangedAt) {
    const changedTimestamp = Math.floor(this.passwordChangedAt.getTime() / 1000);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

export const User = mongoose.model<IUser>('User', userSchema);