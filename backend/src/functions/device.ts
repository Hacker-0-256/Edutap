import crypto from 'crypto';
import mongoose from 'mongoose';
import { Device } from '../models/device.js';
import { DeviceLog } from '../models/deviceLog.js';

// Generate secure API keys for device authentication
export function generateDeviceKeys() {
  const apiKey = crypto.randomBytes(32).toString('hex');
  const secretKey = crypto.randomBytes(64).toString('hex');
  return { apiKey, secretKey };
}

// Register a new IoT device
export async function registerDevice(
  deviceId: string,
  name: string,
  deviceType: string,
  schoolId: string,
  location: any = {},
  capabilities: string[] = []
) {
  try {
    // Check if device already exists
    const existingDevice = await Device.findOne({ deviceId });
    if (existingDevice) {
      throw new Error('Device with this ID already exists');
    }

    // Generate secure keys
    const { apiKey, secretKey } = generateDeviceKeys();

    // Create device
    const device = await Device.create({
      deviceId,
      name,
      deviceType,
      schoolId: new mongoose.Types.ObjectId(schoolId),
      location,
      capabilities: capabilities as any, // Type assertion for flexibility
      apiKey,
      secretKey,
      status: 'offline',
      configuration: {
        firmwareVersion: '1.0.0',
        heartbeatInterval: 30,
        maxRetries: 3,
        timeout: 5000
      }
    });

    // Log device registration
    await DeviceLog.logEvent(
      device._id,
      schoolId,
      'info',
      `Device ${deviceId} registered successfully`,
      { deviceType, capabilities },
      'low'
    );

    return {
      success: true,
      device: {
        id: device._id,
        deviceId: device.deviceId,
        name: device.name,
        deviceType: device.deviceType,
        apiKey: device.apiKey,
        secretKey: device.secretKey,
        status: device.status
      }
    };

  } catch (error: any) {
    console.error('Error registering device:', error.message);
    throw error;
  }
}

// Authenticate device using API key
export async function authenticateDevice(apiKey: string) {
  try {
    const device = await Device.findOne({ apiKey }).populate('schoolId');

    if (!device) {
      throw new Error('Invalid API key');
    }

    if (device.status === 'inactive') {
      throw new Error('Device is inactive');
    }

    return {
      success: true,
      device: {
        id: device._id,
        deviceId: device.deviceId,
        name: device.name,
        schoolId: device.schoolId._id,
        schoolName: (device.schoolId as any).name,
        capabilities: device.capabilities,
        location: device.location
      }
    };

  } catch (error: any) {
    console.error('Device authentication failed:', error.message);
    throw error;
  }
}

// Update device status and health metrics
export async function updateDeviceStatus(
  deviceId: string,
  status: any,
  metrics: any = {}
) {
  try {
    const device = await Device.findOne({ deviceId });
    if (!device) {
      throw new Error('Device not found');
    }

    // Update status and metrics
    device.status = status;
    device.lastSeen = new Date();

    if (metrics.batteryLevel !== undefined) {
      device.batteryLevel = metrics.batteryLevel;
    }
    if (metrics.signalStrength !== undefined) {
      device.signalStrength = metrics.signalStrength;
    }

    await device.save();

    // Log status update
    await DeviceLog.logEvent(
      device._id,
      device.schoolId,
      status === 'online' ? 'device_online' : 'device_offline',
      `Device status changed to ${status}`,
      metrics,
      'low'
    );

    return {
      success: true,
      device: {
        id: device._id,
        deviceId: device.deviceId,
        status: device.status,
        lastSeen: device.lastSeen,
        healthScore: device.getHealthScore()
      }
    };

  } catch (error: any) {
    console.error('Error updating device status:', error.message);
    throw error;
  }
}

// Get device health status
export async function getDeviceHealth(deviceId: string) {
  try {
    const device = await Device.findOne({ deviceId });
    if (!device) {
      throw new Error('Device not found');
    }

    const hoursSinceLastSeen = (Date.now() - device.lastSeen.getTime()) / (1000 * 60 * 60);

    return {
      success: true,
      health: {
        deviceId: device.deviceId,
        status: device.status,
        healthScore: device.getHealthScore(),
        lastSeen: device.lastSeen,
        hoursSinceLastSeen: Math.round(hoursSinceLastSeen * 10) / 10,
        batteryLevel: device.batteryLevel,
        signalStrength: device.signalStrength,
        firmwareVersion: device.firmwareVersion,
        totalScans: device.stats?.totalScans || 0,
        successfulScans: device.stats?.successfulScans || 0,
        uptime: device.stats?.uptime || 0
      }
    };

  } catch (error: any) {
    console.error('Error getting device health:', error.message);
    throw error;
  }
}

// Get all devices for a school
export async function getSchoolDevices(schoolId: string, status?: string) {
  try {
    const query: any = { schoolId };
    if (status) {
      query.status = status;
    }

    const devices = await Device.find(query)
      .select('deviceId name deviceType status lastSeen location capabilities batteryLevel signalStrength')
      .sort({ lastSeen: -1 });

    return {
      success: true,
      count: devices.length,
      devices: devices.map(device => ({
        id: device._id,
        deviceId: device.deviceId,
        name: device.name,
        deviceType: device.deviceType,
        status: device.status,
        lastSeen: device.lastSeen,
        location: device.location,
        capabilities: device.capabilities,
        batteryLevel: device.batteryLevel,
        signalStrength: device.signalStrength,
        healthScore: device.getHealthScore()
      }))
    };

  } catch (error: any) {
    console.error('Error getting school devices:', error.message);
    throw error;
  }
}

// Update device configuration
export async function updateDeviceConfig(deviceId: string, configuration: any) {
  try {
    const device = await Device.findOne({ deviceId });
    if (!device) {
      throw new Error('Device not found');
    }

    // Update configuration
    device.configuration = { ...device.configuration, ...configuration };
    await device.save();

    // Log configuration update
    await DeviceLog.logEvent(
      device._id,
      device.schoolId,
      'configuration_update',
      'Device configuration updated',
      { configuration },
      'medium'
    );

    return {
      success: true,
      device: {
        id: device._id,
        deviceId: device.deviceId,
        configuration: device.configuration
      }
    };

  } catch (error: any) {
    console.error('Error updating device config:', error.message);
    throw error;
  }
}

// Get devices by zone
export async function getDevicesByZone(schoolId: string, zone: string) {
  try {
    const devices = await Device.findByZone(schoolId, zone);

    return {
      success: true,
      zone,
      count: devices.length,
      devices: devices.map(device => ({
        id: device._id,
        deviceId: device.deviceId,
        name: device.name,
        status: device.status,
        location: device.location
      }))
    };

  } catch (error: any) {
    console.error('Error getting devices by zone:', error.message);
    throw error;
  }
}
