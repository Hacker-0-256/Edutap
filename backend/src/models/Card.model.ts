import mongoose, { Schema } from 'mongoose';
import { ICard } from '../interfaces/index.js';
import { CardStatus } from '../types/enums.js';

const cardSchema = new Schema<ICard>({
  cardUID: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  studentId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  linkedParentIds: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  
  cardType: {
    type: String,
    enum: ['student', 'staff', 'visitor'],
    default: 'student',
  },
  status: {
    type: String,
    enum: Object.values(CardStatus),
    default: CardStatus.ACTIVE,
  },
  balance: {
    type: Number,
    default: 0,
    min: 0,
  },
  
  issueDate: {
    type: Date,
    default: Date.now,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  lastUsed: {
    type: Date,
    default: Date.now,
  },
  
  security: {
    pinHash: {
      type: String,
      select: false,
    },
    failedAttempts: {
      type: Number,
      default: 0,
    },
    lastFailedAttempt: Date,
  },
  
  metadata: {
    manufacturer: String,
    batchNumber: String,
    issuedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
}, {
  timestamps: true,
});

// Indexes
cardSchema.index({ cardUID: 1 });
cardSchema.index({ studentId: 1 });
cardSchema.index({ status: 1 });
cardSchema.index({ balance: 1 });
cardSchema.index({ expiryDate: 1 });

// Virtual for isExpired
cardSchema.virtual('isExpired').get(function() {
  return this.expiryDate < new Date();
});

// Update lastUsed timestamp on save
cardSchema.pre('save', function() {
  this.lastUsed = new Date();
  // No next() call is needed for synchronous pre hooks.
});

export const Card = mongoose.model<ICard>('Card', cardSchema);