import mongoose from 'mongoose';
import crypto from 'crypto';

// Transaction model for payment/purchase tracking
const transactionSchema = new mongoose.Schema({
  // Student and account references
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
  
  // Transaction type
  type: {
    type: String,
    enum: ['purchase', 'top-up', 'refund', 'adjustment', 'reversal'],
    required: true
  },
  
  // Amount information
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Balance before and after transaction
  balanceBefore: {
    type: Number,
    required: true
  },
  balanceAfter: {
    type: Number,
    required: true
  },
  
  // Merchant information (for purchases)
  merchantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Merchant'
  },
  
  // Device information
  deviceId: {
    type: String,
    ref: 'Device'
  },
  deviceLocation: {
    type: String
  },
  
  // Transaction details
  description: {
    type: String
  },
  
  // Transaction status
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'reversed', 'cancelled'],
    default: 'pending'
  },
  
  // Unique transaction reference (for idempotency)
  reference: {
    type: String,
    unique: true,
    required: true,
    default: () => `TXN-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`
  },
  
  // Related transaction (for refunds/reversals)
  relatedTransactionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  },
  
  // Payment method (for top-ups)
  paymentMethod: {
    type: String,
    enum: ['mobile_money', 'bank_transfer', 'cash', 'card', 'other']
  },
  
  // Payment gateway reference (for top-ups)
  paymentReference: {
    type: String
  },
  
  // Error information (for failed transactions)
  errorMessage: {
    type: String
  },
  
  // Date information
  date: {
    type: String, // YYYY-MM-DD format for easy querying
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  }
}, {
  timestamps: true
});

// Indexes for performance
transactionSchema.index({ studentId: 1, timestamp: -1 });
transactionSchema.index({ accountId: 1, timestamp: -1 });
transactionSchema.index({ merchantId: 1, timestamp: -1 });
transactionSchema.index({ date: 1 });
transactionSchema.index({ type: 1, timestamp: -1 });
transactionSchema.index({ status: 1 });
// Note: reference already has unique: true which creates an index

// Static method to create purchase transaction
transactionSchema.statics.createPurchase = async function(
  studentId: any,
  accountId: any,
  amount: number,
  merchantId: any,
  deviceId: string,
  deviceLocation: string,
  description?: string
) {
  const Account = mongoose.model('Account');
  const account = await Account.findById(accountId);
  
  if (!account) {
    throw new Error('Account not found');
  }
  
  const balanceBefore = account.balance;
  
  // Deduct balance
  await account.deductBalance(amount);
  
  const balanceAfter = account.balance;
  const date = new Date().toISOString().split('T')[0];
  
  return this.create({
    studentId,
    accountId,
    type: 'purchase',
    amount,
    balanceBefore,
    balanceAfter,
    merchantId,
    deviceId,
    deviceLocation,
    description: description || `Purchase at ${deviceLocation}`,
    status: 'completed',
    date
  });
};

// Static method to create top-up transaction
transactionSchema.statics.createTopUp = async function(
  studentId: any,
  accountId: any,
  amount: number,
  paymentMethod: string,
  paymentReference?: string
) {
  const Account = mongoose.model('Account');
  const account = await Account.findById(accountId);
  
  if (!account) {
    throw new Error('Account not found');
  }
  
  const balanceBefore = account.balance;
  
  // Add balance
  await account.addBalance(amount, paymentMethod);
  
  const balanceAfter = account.balance;
  const date = new Date().toISOString().split('T')[0];
  
  return this.create({
    studentId,
    accountId,
    type: 'top-up',
    amount,
    balanceBefore,
    balanceAfter,
    paymentMethod,
    paymentReference,
    description: `Top-up via ${paymentMethod}`,
    status: 'completed',
    date
  });
};

// Method to reverse/refund transaction
transactionSchema.methods.reverse = async function(reason?: string) {
  if (this.status === 'reversed') {
    throw new Error('Transaction already reversed');
  }
  
  if (this.type !== 'purchase') {
    throw new Error('Only purchase transactions can be reversed');
  }
  
  const Account = mongoose.model('Account');
  const account = await Account.findById(this.accountId);
  
  if (!account) {
    throw new Error('Account not found');
  }
  
  // Add balance back
  await account.addBalance(this.amount);
  
  // Create reversal transaction
  const Transaction = mongoose.model('Transaction');
  const reversal = await Transaction.create({
    studentId: this.studentId,
    accountId: this.accountId,
    type: 'reversal',
    amount: this.amount,
    balanceBefore: account.balance - this.amount,
    balanceAfter: account.balance,
    relatedTransactionId: this._id,
    description: `Reversal: ${reason || 'Refund'}`,
    status: 'completed',
    date: new Date().toISOString().split('T')[0]
  });
  
  // Update original transaction
  this.status = 'reversed';
  this.relatedTransactionId = reversal._id;
  await this.save();
  
  return reversal;
};

export const Transaction = mongoose.model('Transaction', transactionSchema);

