import express from 'express';
import { DeviceLog } from '../models/deviceLog.js';

const router = express.Router();

// Get device logs with filtering
router.get('/device/:deviceId', async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { limit = 50, eventType, severity, startDate, endDate } = req.query;

    // Build query
    const query: any = { deviceId };

    if (eventType) query.eventType = eventType;
    if (severity) query.severity = severity;
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate as string);
      if (endDate) query.timestamp.$lte = new Date(endDate as string);
    }

    const logs = await DeviceLog.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit as string))
      .populate('deviceId', 'deviceId name')
      .populate('schoolId', 'name');

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Get school-wide logs
router.get('/school/:schoolId', async (req, res) => {
  try {
    const { schoolId } = req.params;
    const { limit = 100, eventType, severity, startDate, endDate, deviceId } = req.query;

    // Build query
    const query: any = { schoolId };

    if (deviceId) query.deviceId = deviceId;
    if (eventType) query.eventType = eventType;
    if (severity) query.severity = severity;
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate as string);
      if (endDate) query.timestamp.$lte = new Date(endDate as string);
    }

    const logs = await DeviceLog.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit as string))
      .populate('deviceId', 'deviceId name deviceType')
      .populate('schoolId', 'name');

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Get error summary for school
router.get('/school/:schoolId/errors', async (req, res) => {
  try {
    const { schoolId } = req.params;
    const { days = 7 } = req.query;

    const errorSummary = await DeviceLog.getErrorSummary(schoolId, parseInt(days as string));

    res.status(200).json({
      success: true,
      data: errorSummary
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Get device activity summary
router.get('/device/:deviceId/activity', async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { hours = 24 } = req.query;

    const activity = await DeviceLog.getDeviceActivity(deviceId, parseInt(hours as string));

    res.status(200).json({
      success: true,
      data: activity
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Get log statistics
router.get('/stats/:schoolId', async (req, res) => {
  try {
    const { schoolId } = req.params;
    const { days = 30 } = req.query;

    const since = new Date(Date.now() - (parseInt(days as string) * 24 * 60 * 60 * 1000));

    const stats = await DeviceLog.aggregate([
      {
        $match: {
          schoolId: require('mongoose').Types.ObjectId(schoolId),
          timestamp: { $gte: since }
        }
      },
      {
        $group: {
          _id: {
            eventType: '$eventType',
            severity: '$severity'
          },
          count: { $sum: 1 },
          lastEvent: { $max: '$timestamp' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
