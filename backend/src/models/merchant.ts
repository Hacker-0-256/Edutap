import mongoose from 'mongoose';

// Merchant model for canteen/merchant management
const merchantSchema = new mongoose.Schema({
  // Merchant identification
  name: {
    type: String,
    required: true
  },
  
  // Merchant type
  type: {
    type: String,
    enum: ['canteen', 'cafeteria', 'store', 'other'],
    required: true,
    default: 'canteen'
  },
  
  // School association
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true
  },
  
  // Location information
  location: {
    building: String,
    floor: String,
    room: String,
    zone: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  
  // Contact information
  contact: {
    phone: String,
    email: String,
    managerName: String
  },
  
  // Merchant status
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Operating hours
  operatingHours: {
    openTime: String, // e.g., "08:00"
    closeTime: String, // e.g., "17:00"
    daysOfWeek: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }]
  },
  
  // Statistics
  stats: {
    totalSales: { type: Number, default: 0 },
    totalTransactions: { type: Number, default: 0 },
    averageTransactionAmount: { type: Number, default: 0 },
    lastTransactionDate: Date
  }
}, {
  timestamps: true
});

// Indexes for performance
merchantSchema.index({ schoolId: 1 });
merchantSchema.index({ type: 1 });
merchantSchema.index({ isActive: 1 });

// Method to update sales statistics
merchantSchema.methods.updateSales = function(amount: number) {
  this.stats.totalSales += amount;
  this.stats.totalTransactions += 1;
  this.stats.averageTransactionAmount = this.stats.totalSales / this.stats.totalTransactions;
  this.stats.lastTransactionDate = new Date();
  return this.save();
};

// Method to get sales summary
merchantSchema.methods.getSalesSummary = function(startDate?: Date, endDate?: Date) {
  // This would typically query transactions, but for now return basic stats
  return {
    totalSales: this.stats.totalSales,
    totalTransactions: this.stats.totalTransactions,
    averageTransactionAmount: this.stats.averageTransactionAmount,
    lastTransactionDate: this.stats.lastTransactionDate
  };
};

export const Merchant = mongoose.model('Merchant', merchantSchema);


