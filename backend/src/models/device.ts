import mongoose from 'mongoose';

// IoT Device model for managing RFID/NFC readers and other IoT devices
const deviceSchema = new mongoose.Schema({
  // Device identification
  deviceId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true
  },

  // Device type and capabilities
  deviceType: {
    type: String,
    enum: ['esp32', 'rfid_reader', 'pos', 'canteen_reader', 'attendance_reader'],
    required: true
  },
  capabilities: [{
    type: String,
    enum: ['rfid', 'nfc']
  }],

  // Location and zone
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

  // Device status and health
  status: {
    type: String,
    enum: ['online', 'offline', 'maintenance', 'faulty', 'inactive'],
    default: 'offline'
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  batteryLevel: Number,
  signalStrength: Number,

  // Authentication and security
  apiKey: {
    type: String,
    required: true,
    unique: true
  },
  secretKey: {
    type: String,
    required: true
  },

  // Configuration
  configuration: {
    firmwareVersion: String,
    heartbeatInterval: { type: Number, default: 30 }, // seconds
    maxRetries: { type: Number, default: 3 },
    timeout: { type: Number, default: 5000 }, // milliseconds
    settings: mongoose.Schema.Types.Mixed // Flexible configuration object
  },

  // School association
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true
  },
  
  // Merchant association (for POS/canteen devices)
  merchantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Merchant'
  },

  // Maintenance and updates
  firmwareVersion: String,
  lastFirmwareUpdate: Date,
  maintenanceSchedule: Date,
  notes: String,

  // Statistics
  stats: {
    totalScans: { type: Number, default: 0 },
    successfulScans: { type: Number, default: 0 },
    failedScans: { type: Number, default: 0 },
    uptime: { type: Number, default: 0 }, // hours
    lastReset: Date
  }
}, {
  timestamps: true
});

// Indexes for performance
deviceSchema.index({ deviceId: 1 });
deviceSchema.index({ schoolId: 1 });
deviceSchema.index({ status: 1 });
deviceSchema.index({ 'location.zone': 1 });
deviceSchema.index({ lastSeen: 1 });

// Method to calculate health score
deviceSchema.methods.getHealthScore = function() {
  let score = 100;

  // Deduct points for various issues
  if (this.status !== 'online') score -= 30;
  if (this.batteryLevel && this.batteryLevel < 20) score -= 20;
  if (this.signalStrength && this.signalStrength < 50) score -= 15;

  const hoursSinceLastSeen = (Date.now() - this.lastSeen.getTime()) / (1000 * 60 * 60);
  if (hoursSinceLastSeen > 1) score -= Math.min(35, hoursSinceLastSeen * 5);

  return Math.max(0, score);
};

// Method to update device status
deviceSchema.methods.updateStatus = function(newStatus: string, additionalData: any = {}) {
  this.status = newStatus;
  this.lastSeen = new Date();

  if (additionalData.batteryLevel !== undefined) {
    this.batteryLevel = additionalData.batteryLevel;
  }
  if (additionalData.signalStrength !== undefined) {
    this.signalStrength = additionalData.signalStrength;
  }

  return this.save();
};

// Method to authenticate device
deviceSchema.methods.authenticate = function(providedApiKey: string) {
  return this.apiKey === providedApiKey;
};

// Static method to find devices by zone
deviceSchema.statics.findByZone = function(schoolId: any, zone: string) {
  return this.find({
    schoolId,
    'location.zone': zone,
    status: { $in: ['online', 'maintenance'] }
  });
};

export const Device = mongoose.model('Device', deviceSchema);
