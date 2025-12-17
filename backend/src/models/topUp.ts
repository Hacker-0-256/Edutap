import mongoose from 'mongoose';
import crypto from 'crypto';

// TopUp model for top-up requests and processing
const topUpSchema = new mongoose.Schema({
  // Student and parent references
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parent',
    required: false // Optional for manual top-ups created by admin
  },
  
  // Top-up amount
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Payment method
  paymentMethod: {
    type: String,
    enum: ['mobile_money', 'bank_transfer', 'cash', 'card', 'other'],
    required: true
  },
  
  // Payment gateway information
  paymentGateway: {
    type: String,
    enum: ['mpesa', 'mtn_mobile_money', 'airtel_money', 'bank', 'cash', 'other']
  },
  
  // Payment reference from gateway (optional - for future payment gateway integration)
  paymentReference: {
    type: String,
    unique: true,
    sparse: true // Allow null values but ensure uniqueness when present
  },
  
  // Who processed the top-up (for manual processing)
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Internal reference
  topUpReference: {
    type: String,
    unique: true,
    required: true,
    default: () => `TOPUP-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  
  // Payment gateway response
  gatewayResponse: {
    type: mongoose.Schema.Types.Mixed
  },
  
  // Error information
  errorMessage: {
    type: String
  },
  
  // Timestamps
  initiatedAt: {
    type: Date,
    default: Date.now
  },
  processedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for performance
topUpSchema.index({ studentId: 1, createdAt: -1 });
topUpSchema.index({ parentId: 1, createdAt: -1 });
topUpSchema.index({ accountId: 1 });
topUpSchema.index({ status: 1 });
topUpSchema.index({ topUpReference: 1 }); // Unique index
topUpSchema.index({ paymentReference: 1 }); // Sparse unique index

// Method to mark as processing
topUpSchema.methods.markAsProcessing = function() {
  this.status = 'processing';
  this.processedAt = new Date();
  return this.save();
};

// Method to mark as completed
topUpSchema.methods.markAsCompleted = function(paymentReference?: string, gatewayResponse?: any, processedBy?: any) {
  this.status = 'completed';
  this.completedAt = new Date();
  if (paymentReference) {
    this.paymentReference = paymentReference;
  }
  if (gatewayResponse) {
    this.gatewayResponse = gatewayResponse;
  }
  if (processedBy) {
    this.processedBy = processedBy;
  }
  return this.save();
};

// Method to mark as failed
topUpSchema.methods.markAsFailed = function(errorMessage: string) {
  this.status = 'failed';
  this.errorMessage = errorMessage;
  this.processedAt = new Date();
  return this.save();
};

// Method to cancel
topUpSchema.methods.cancel = function() {
  this.status = 'cancelled';
  this.processedAt = new Date();
  return this.save();
};

export const TopUp = mongoose.model('TopUp', topUpSchema);

