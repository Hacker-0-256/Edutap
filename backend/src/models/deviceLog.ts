import mongoose from 'mongoose';

// Device log model for tracking all IoT device activities and events
const deviceLogSchema = new mongoose.Schema({
  // Device reference
  deviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Device',
    required: true
    // Note: Mongoose auto-indexes required ObjectId refs
    // We also have a compound index, which is fine - both will work
  },

  // Event details
  eventType: {
    type: String,
    enum: [
      'device_online',
      'device_offline',
      'device_heartbeat',
      'attendance_scan',
      'scan_success',
      'scan_failure',
      'configuration_update',
      'firmware_update',
      'maintenance_start',
      'maintenance_end',
      'error',
      'warning',
      'info'
    ],
    required: true
  },

  // Event severity
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'low'
  },

  // Event data
  message: {
    type: String,
    required: true
  },

  // Additional metadata
  metadata: {
    cardUID: String,
    studentId: mongoose.Schema.Types.ObjectId,
    scanResult: String,
    errorCode: String,
    batteryLevel: Number,
    signalStrength: Number,
    temperature: Number,
    firmwareVersion: String,
    ipAddress: String,
    userAgent: String,
    additionalData: mongoose.Schema.Types.Mixed
  },

  // Location context
  location: {
    zone: String,
    building: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },

  // Timestamps
  timestamp: {
    type: Date,
    default: Date.now
  },

  // School reference for partitioning
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true
  }
}, {
  timestamps: false, // We use custom timestamp field
  autoIndex: true // Allow auto-indexing but we'll manage duplicates
});

// Indexes for performance and querying
// Note: deviceId is auto-indexed by Mongoose (required ObjectId ref)
// We create compound index which includes deviceId, so the single index is redundant but harmless
deviceLogSchema.index({ deviceId: 1, timestamp: -1 }, { background: true });
deviceLogSchema.index({ schoolId: 1, timestamp: -1 });
deviceLogSchema.index({ eventType: 1, timestamp: -1 });
deviceLogSchema.index({ severity: 1, timestamp: -1 });
deviceLogSchema.index({ 'metadata.cardUID': 1, timestamp: -1 });

// TTL index to automatically delete old logs (90 days)
deviceLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

// Static method to log device event
deviceLogSchema.statics.logEvent = async function(
  deviceId: any,
  schoolId: any,
  eventType: string,
  message: string,
  metadata: any = {},
  severity: string = 'low'
) {
  return this.create({
    deviceId,
    schoolId,
    eventType,
    severity,
    message,
    metadata,
    timestamp: new Date()
  });
};

// Static method to get device activity summary
deviceLogSchema.statics.getDeviceActivity = async function(deviceId: string, hours: number = 24) {
  const since = new Date(Date.now() - (hours * 60 * 60 * 1000));

  return this.aggregate([
    {
      $match: {
        deviceId: new mongoose.Types.ObjectId(deviceId),
        timestamp: { $gte: since }
      }
    },
    {
      $group: {
        _id: '$eventType',
        count: { $sum: 1 },
        lastEvent: { $max: '$timestamp' }
      }
    }
  ]);
};

// Static method to get error summary
deviceLogSchema.statics.getErrorSummary = async function(schoolId: string, days: number = 7) {
  const since = new Date(Date.now() - (days * 24 * 60 * 60 * 1000));

  return this.aggregate([
    {
      $match: {
        schoolId: new mongoose.Types.ObjectId(schoolId),
        timestamp: { $gte: since },
        severity: { $in: ['high', 'critical'] }
      }
    },
    {
      $group: {
        _id: {
          deviceId: '$deviceId',
          eventType: '$eventType'
        },
        count: { $sum: 1 },
        lastError: { $max: '$timestamp' },
        messages: { $push: '$message' }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);
};

export const DeviceLog = mongoose.model('DeviceLog', deviceLogSchema);
