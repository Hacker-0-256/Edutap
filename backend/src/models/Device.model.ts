import mongoose, { Schema } from 'mongoose';
import { IDevice } from '../interfaces/index.js';
import { DeviceType, DeviceStatus } from '../types/enums.js';

const deviceSchema = new Schema<IDevice>({
  deviceId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  deviceType: {
    type: String,
    enum: Object.values(DeviceType),
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  
  location: {
    building: String,
    floor: Number,
    room: String,
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
  
  status: {
    type: String,
    enum: Object.values(DeviceStatus),
    default: DeviceStatus.OFFLINE,
  },
  lastPing: {
    type: Date,
    default: Date.now,
  },
  
  configuration: {
    ipAddress: String,
    firmwareVersion: String,
    supportedProtocols: [String],
  },
  
  capabilities: {
    nfc: Boolean,
    pinEntry: Boolean,
    receiptPrinting: Boolean,
    biometrics: Boolean,
  },
  
  security: {
    apiKeyHash: {
      type: String,
      select: false,
    },
    allowedIPs: [String],
    lastKeyRotation: Date,
  },
}, {
  timestamps: true,
});

// Indexes
deviceSchema.index({ deviceId: 1 });
deviceSchema.index({ deviceType: 1 });
deviceSchema.index({ status: 1 });
deviceSchema.index({ 'location.coordinates': '2dsphere' });

// Update lastPing every minute in background (simulated)
// FIX: Removed 'next' parameter and 'next()' call
deviceSchema.pre('save', function() { 
  this.lastPing = new Date();
  // The hook finishes automatically.
});

export const Device = mongoose.model<IDevice>('Device', deviceSchema);
