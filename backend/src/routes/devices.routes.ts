import express from 'express';
import {
  registerDevice,
  authenticateDevice,
  updateDeviceStatus,
  getDeviceHealth,
  getSchoolDevices,
  updateDeviceConfig,
  getDevicesByZone
} from '../functions/device.js';

const router = express.Router();

// Register a new IoT device
router.post('/register', async (req, res) => {
  try {
    const {
      deviceId,
      name,
      deviceType,
      schoolId,
      location,
      capabilities
    } = req.body;

    // Simple validation
    if (!deviceId || !name || !deviceType || !schoolId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide deviceId, name, deviceType, and schoolId'
      });
    }

    const result = await registerDevice(
      deviceId,
      name,
      deviceType,
      schoolId,
      location,
      capabilities
    );

    res.status(201).json({
      success: true,
      message: 'Device registered successfully',
      data: result
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Authenticate device (used by IoT devices)
router.post('/auth', async (req, res) => {
  try {
    const { apiKey } = req.body;

    if (!apiKey) {
      return res.status(400).json({
        success: false,
        message: 'API key is required'
      });
    }

    const result = await authenticateDevice(apiKey);

    res.status(200).json({
      success: true,
      message: 'Device authenticated successfully',
      data: result
    });

  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
});

// Update device status (heartbeat from IoT devices)
router.post('/:deviceId/status', async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { status, metrics } = req.body;

    // Simple validation
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const result = await updateDeviceStatus(deviceId, status, metrics);

    res.status(200).json({
      success: true,
      message: 'Device status updated successfully',
      data: result
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Get device health information
router.get('/:deviceId/health', async (req, res) => {
  try {
    const { deviceId } = req.params;

    const result = await getDeviceHealth(deviceId);

    res.status(200).json({
      success: true,
      message: 'Device health retrieved successfully',
      data: result
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Get all devices for a school
router.get('/school/:schoolId', async (req, res) => {
  try {
    const { schoolId } = req.params;
    const { status } = req.query;

    const result = await getSchoolDevices(schoolId, status as string);

    res.status(200).json({
      success: true,
      message: 'School devices retrieved successfully',
      data: result
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Update device configuration
router.put('/:deviceId/config', async (req, res) => {
  try {
    const { deviceId } = req.params;
    const configuration = req.body;

    const result = await updateDeviceConfig(deviceId, configuration);

    res.status(200).json({
      success: true,
      message: 'Device configuration updated successfully',
      data: result
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Get devices by zone
router.get('/zone/:schoolId/:zone', async (req, res) => {
  try {
    const { schoolId, zone } = req.params;

    const result = await getDevicesByZone(schoolId, zone);

    res.status(200).json({
      success: true,
      message: 'Zone devices retrieved successfully',
      data: result
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Get device details
router.get('/:deviceId', async (req, res) => {
  try {
    const { deviceId } = req.params;

    // Import Device model for this specific query
    const { Device } = await import('../models/device.js');

    const device = await Device.findOne({ deviceId })
      .populate('schoolId', 'name address');

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        device: {
          id: device._id,
          deviceId: device.deviceId,
          name: device.name,
          deviceType: device.deviceType,
          status: device.status,
          location: device.location,
          capabilities: device.capabilities,
          lastSeen: device.lastSeen,
          batteryLevel: device.batteryLevel,
          signalStrength: device.signalStrength,
          configuration: device.configuration,
          firmwareVersion: device.firmwareVersion,
          school: device.schoolId,
          stats: device.stats,
          healthScore: device.getHealthScore()
        }
      }
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
