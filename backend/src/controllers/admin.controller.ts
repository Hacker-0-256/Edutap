import { School } from '../models/school.js';
import { DeviceLog } from '../models/deviceLog.js';
import { User } from '../models/user.js';

// Admin controller for managing schools and logs

// Create a new school
export async function createSchool(req: any, res: any) {
  try {
    const { name, address, phone, email, openingTime, closingTime } = req.body;

    // Simple validation
    if (!name || !address || !phone || !email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Create school
    const school = await School.create({
      name,
      address,
      phone,
      email,
      openingTime,
      closingTime
    });

    res.status(201).json({
      success: true,
      message: 'School created successfully',
      data: school
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

// Get all schools
export async function getSchools(req: any, res: any) {
  try {
    const schools = await School.find({ isActive: true });

    res.status(200).json({
      success: true,
      count: schools.length,
      data: schools
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

// Get a single school
export async function getSchool(req: any, res: any) {
  try {
    const school = await School.findById(req.params.id);

    if (!school) {
      return res.status(404).json({
        success: false,
        message: 'School not found'
      });
    }

    res.status(200).json({
      success: true,
      data: school
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

// Update a school
export async function updateSchool(req: any, res: any) {
  try {
    const school = await School.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!school) {
      return res.status(404).json({
        success: false,
        message: 'School not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'School updated successfully',
      data: school
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

// Delete (deactivate) a school
export async function deleteSchool(req: any, res: any) {
  try {
    const school = await School.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!school) {
      return res.status(404).json({
        success: false,
        message: 'School not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'School deactivated successfully'
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

// Get system-wide logs
export async function getSystemLogs(req: any, res: any) {
  try {
    const { limit = 100, eventType, severity, startDate, endDate, schoolId } = req.query;

    // Build query
    const query: any = {};

    if (schoolId) query.schoolId = schoolId;
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
}

// Get log statistics across all schools
export async function getLogStats(req: any, res: any) {
  try {
    const { days = 30 } = req.query;

    const since = new Date(Date.now() - (parseInt(days as string) * 24 * 60 * 60 * 1000));

    const stats = await DeviceLog.aggregate([
      {
        $match: {
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
}

// Delete old logs (cleanup)
export async function cleanupLogs(req: any, res: any) {
  try {
    const { days = 90 } = req.body; // Default 90 days

    const cutoffDate = new Date(Date.now() - (parseInt(days) * 24 * 60 * 60 * 1000));

    const result = await DeviceLog.deleteMany({
      timestamp: { $lt: cutoffDate }
    });

    res.status(200).json({
      success: true,
      message: `Deleted ${result.deletedCount} old log entries`
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

// Get all users (for admin management)
export async function getUsers(req: any, res: any) {
  try {
    const users = await User.find({})
      .select('-password') // Exclude password
      .populate('schoolId', 'name')
      .populate('parentId', 'firstName lastName');

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}