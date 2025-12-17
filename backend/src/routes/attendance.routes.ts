import express from 'express';
import { recordAttendance, getStudentAttendance, getTodayAttendance } from '../functions/attendance.js';
import { sendSMS } from '../functions/sms.js';

const router = express.Router();

// Record attendance when student taps card (arrival only)
// This endpoint will be called by the IoT device (RFID/NFC reader)
router.post('/record', async (req, res) => {
  try {
    const { cardUID, deviceId, deviceLocation } = req.body;

    // Simple validation
    if (!cardUID || !deviceId || !deviceLocation) {
      return res.status(400).json({
        success: false,
        message: 'Please provide cardUID, deviceId, and deviceLocation'
      });
    }

    const result = await recordAttendance(cardUID, deviceId, deviceLocation);

    res.status(201).json({
      success: true,
      message: 'Attendance recorded successfully',
      data: result
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Test SMS endpoint
router.post('/test-sms', async (req, res) => {
  try {
    const { phoneNumber, message } = req.body;

    if (!phoneNumber || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide phoneNumber and message'
      });
    }

    const result = await sendSMS(phoneNumber, message);

    res.status(200).json({
      success: true,
      message: 'SMS test completed',
      data: result
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Get attendance history for a specific student
router.get('/student/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const { startDate, endDate } = req.query;

    const result = await getStudentAttendance(
      studentId, 
      startDate as string, 
      endDate as string
    );

    res.status(200).json({
      success: true,
      message: 'Attendance records retrieved successfully',
      data: result
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Get today's attendance for a school
router.get('/today/:schoolId', async (req, res) => {
  try {
    const { schoolId } = req.params;

    const result = await getTodayAttendance(schoolId);

    res.status(200).json({
      success: true,
      message: 'Today\'s attendance retrieved successfully',
      data: result
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
