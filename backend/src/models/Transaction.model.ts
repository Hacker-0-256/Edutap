import mongoose, { Schema } from 'mongoose';
import { ITransaction } from '../interfaces';
import { TransactionType } from '../types/enums';

const transactionSchema = new Schema<ITransaction>({
  transactionType: {
    type: String,
    enum: Object.values(TransactionType),
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    default: 'INR',
  },
  
  purchaseDetails: {
    items: [{
      itemId: {
        type: Schema.Types.ObjectId,
        ref: 'CanteenItem',
      },
      name: String,
      quantity: Number,
      unitPrice: Number,
    }],
    canteenId: {
      type: Schema.Types.ObjectId,
      ref: 'Device',
    },
    totalAmount: Number,
  },
  
  topUpDetails: {
    method: {
      type: String,
      enum: ['cash', 'card', 'bank_transfer', 'online'],
    },
    initiatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    receiptNumber: String,
    previousBalance: Number,
    newBalance: Number,
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
  parentId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  
  status: {
    type: String,
    enum: ['completed', 'pending', 'failed', 'reversed'],
    default: 'completed',
  },
  
  audit: {
    initiatedByDevice: {
      type: Schema.Types.ObjectId,
      ref: 'Device',
    },
    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    sessionId: String,
  },
}, {
  timestamps: true,
});

// Indexes
transactionSchema.index({ studentId: 1, createdAt: -1 });
transactionSchema.index({ cardId: 1 });
transactionSchema.index({ transactionType: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ parentId: 1 });
transactionSchema.index({ 'audit.sessionId': 1 });

export const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);