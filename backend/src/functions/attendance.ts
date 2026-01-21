import { Student } from '../models/student.js';
import { Parent } from '../models/parent.js';
import { School } from '../models/school.js';
import { Attendance } from '../models/attendance.js';
import { Device } from '../models/device.js';
import { DeviceLog } from '../models/deviceLog.js';
import { sendSMS } from './sms.js';

// io will be set from app.ts to avoid circular dependency
export let io: any = null;

export function setSocketIO(socketIO: any) {
  io = socketIO;
}

// Simple function to record attendance when a student taps their card (arrival only)
export async function recordAttendance(
  cardUID: string,
  deviceId: string,
  deviceLocation: string
) {
  try {
    // 1. Find the student by their card UID
    const student = await Student.findOne({ cardUID, isActive: true });
    if (!student) {
      throw new Error('Student not found or card is not active');
    }

    // 2. Find parent and school separately
    const parentData = await Parent.findById(student.parentId);
    const schoolData = await School.findById(student.schoolId);

    // 3. Find and validate device
    const device = await Device.findOne({ deviceId });
    if (!device) {
      throw new Error('Device not found');
    }

    // 3. Get current date and time
    const now = new Date();
    const dateString = now.toISOString().substring(0, 10); // YYYY-MM-DD

    // 4. Create attendance record
    const attendance = await Attendance.create({
      studentId: student._id,
      schoolId: student.schoolId,
      type: 'check-in',
      timestamp: now,
      date: dateString,
      deviceId: deviceId,
      deviceLocation: deviceLocation,
      smsNotificationSent: false
    });

    // 5. Update device statistics
    if (!device.stats) {
      device.stats = {
        totalScans: 0,
        successfulScans: 0,
        failedScans: 0,
        uptime: 0,
        lastReset: new Date()
      };
    }
    device.stats.totalScans += 1;
    device.stats.successfulScans += 1;
    await device.save();

    // 6. Log successful scan
    await (DeviceLog as any).logEvent(
      device._id,
      device.schoolId,
      'scan_success',
      `Attendance recorded: ${student.firstName} ${student.lastName} - check-in`,
      {
        cardUID,
        studentId: student._id,
        attendanceId: attendance._id,
        type: 'check-in'
      },
      'low'
    );

    // 7. Get parent information
    const parent = parentData;

    // 8. Send SMS notification to parent
    let smsResult: { success: boolean; error?: string } = { success: false };

    if (parent && parent.receiveSMS && parent.phone) {
      try {
        // Format time nicely
        const timeString = now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });

        // Create SMS message
        const message = `Hello ${parent.firstName}, your child ${student.firstName} ${student.lastName} has arrived at school at ${timeString} on ${dateString}. - ${schoolData?.name || 'School'}`;

        // Send SMS
        const smsResponse = await sendSMS(parent.phone, message);
        smsResult = {
          success: smsResponse.success,
          error: smsResponse.success ? undefined : smsResponse.error
        };
      } catch (smsError: any) {
        console.error('Error sending SMS notification:', smsError.message);
        smsResult = {
          success: false,
          error: smsError.message
        };
      }
    }

    // Update attendance record with SMS status
    attendance.smsNotificationSent = smsResult.success;
    if (!smsResult.success) {
      attendance.smsNotificationError = smsResult.error;
    }
    await attendance.save();

    // 9. Real-time notifications (if Socket.io is available)
    if (io) {
      const schoolId = schoolData._id.toString();

      // Emit to school room
      io.to(`school-${schoolId}`).emit('new-attendance', {
        studentName: `${student.firstName} ${student.lastName}`,
        type: attendance.type,
        timestamp: attendance.timestamp,
        location: attendance.deviceLocation,
        deviceId: deviceId
      });

      // Emit to device room
      io.to(`device-${deviceId}`).emit('attendance-recorded', {
        attendanceId: attendance._id,
        studentName: `${student.firstName} ${student.lastName}`,
        type: attendance.type,
        timestamp: attendance.timestamp
      });
    }

    // Get photo URL helper
    const { getPhotoUrl } = await import('../middleware/upload.middleware.js');
    
    return {
      success: true,
      attendance: {
        id: attendance._id,
        studentName: `${student.firstName} ${student.lastName}`,
        type: attendance.type,
        timestamp: attendance.timestamp,
        location: attendance.deviceLocation
      },
      student: {
        id: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
        studentId: student.studentId,
        photo: getPhotoUrl(student.photo) // Include photo URL
      },
      smsNotification: {
        sent: smsResult.success,
        parentPhone: parent?.phone,
        error: smsResult.error
      }
    };

  } catch (error: any) {
    console.error('Error recording attendance:', error.message);
    throw error;
  }
}

// Simple function to get attendance history for a student
export async function getStudentAttendance(studentId: string, startDate?: string, endDate?: string) {
  try {
    const query: any = { studentId };

    // Add date filter if provided
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }

    const attendanceRecords = await Attendance.find(query)
      .sort({ timestamp: -1 })
      .populate('studentId', 'firstName lastName studentId')
      .populate('schoolId', 'name');

    return {
      success: true,
      count: attendanceRecords.length,
      records: attendanceRecords
    };

  } catch (error: any) {
    console.error('Error fetching attendance:', error.message);
    throw error;
  }
}

// Simple function to get today's attendance for a school
export async function getTodayAttendance(schoolId: string) {
  try {
    const today = new Date().toISOString().split('T')[0];

    const attendanceRecords = await Attendance.find({
      schoolId,
      date: today
    })
      .sort({ timestamp: -1 })
      .populate('studentId', 'firstName lastName studentId grade class');

    return {
      success: true,
      date: today,
      count: attendanceRecords.length,
      records: attendanceRecords
    };

  } catch (error: any) {
    console.error('Error fetching today attendance:', error.message);
    throw error;
  }
}
