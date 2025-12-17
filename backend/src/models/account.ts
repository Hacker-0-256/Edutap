import mongoose from 'mongoose';

// Account/Wallet model for student balances
const accountSchema = new mongoose.Schema({
  // Link to student
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
    unique: true
  },
  
  // Balance information
  balance: {
    type: Number,
    required: true,
    default: 0,
    min: 0 // Balance cannot be negative
  },
  
  // Currency (RWF for Rwanda)
  currency: {
    type: String,
    required: true,
    default: 'RWF'
  },
  
  // Account status
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Last top-up information
  lastTopUp: {
    amount: Number,
    date: Date,
    method: String // 'mobile_money', 'bank_transfer', 'cash', etc.
  },
  
  // Account limits (optional)
  dailySpendLimit: {
    type: Number,
    default: null // null means no limit
  },
  
  // Statistics
  stats: {
    totalDeposits: { type: Number, default: 0 },
    totalWithdrawals: { type: Number, default: 0 },
    totalTransactions: { type: Number, default: 0 },
    lastTransactionDate: Date
  }
}, {
  timestamps: true
});

// Indexes for performance
accountSchema.index({ studentId: 1 });
accountSchema.index({ isActive: 1 });
accountSchema.index({ 'stats.lastTransactionDate': -1 });

// Method to add balance (for top-ups)
accountSchema.methods.addBalance = function(amount: number, method?: string) {
  if (amount <= 0) {
    throw new Error('Amount must be greater than zero');
  }
  
  this.balance += amount;
  this.stats.totalDeposits += amount;
  
  if (method) {
    this.lastTopUp = {
      amount,
      date: new Date(),
      method
    };
  }
  
  return this.save();
};

// Method to deduct balance (for payments)
accountSchema.methods.deductBalance = function(amount: number) {
  if (amount <= 0) {
    throw new Error('Amount must be greater than zero');
  }
  
  if (this.balance < amount) {
    throw new Error('Insufficient balance');
  }
  
  this.balance -= amount;
  this.stats.totalWithdrawals += amount;
  this.stats.lastTransactionDate = new Date();
  
  return this.save();
};

// Method to check if balance is sufficient
accountSchema.methods.hasSufficientBalance = function(amount: number): boolean {
  return this.balance >= amount;
};

// Method to get account summary
accountSchema.methods.getSummary = function() {
  return {
    balance: this.balance,
    currency: this.currency,
    isActive: this.isActive,
    totalDeposits: this.stats.totalDeposits,
    totalWithdrawals: this.stats.totalWithdrawals,
    netBalance: this.stats.totalDeposits - this.stats.totalWithdrawals
  };
};

export const Account = mongoose.model('Account', accountSchema);


