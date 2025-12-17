import { Device } from '../models/device.js';
import { recordAttendance } from './attendance.js';
import { processPayment } from './payment.js';
import { validateCardStatus } from './card.js';

// Unified card tap handler - routes to attendance or payment based on device type
export async function handleCardTap(
  cardUID: string,
  deviceId: string,
  deviceLocation: string,
  amount?: number,
  description?: string
) {
  try {
    // 1. Validate card status first
    const cardValid = await validateCardStatus(cardUID);
    if (!cardValid) {
      throw new Error('Card is not active or student not found');
    }

    // 2. Find and validate device
    const device = await Device.findOne({ deviceId });
    if (!device) {
      throw new Error('Device not found');
    }

    // 3. Check device status
    if (device.status !== 'online' && device.status !== 'maintenance') {
      throw new Error(`Device is ${device.status}. Cannot process card tap.`);
    }

    // 4. Route based on device type
    const isPaymentDevice = ['pos', 'canteen_reader'].includes(device.deviceType);
    const isAttendanceDevice = ['esp32', 'rfid_reader', 'attendance_reader'].includes(device.deviceType);

    if (isPaymentDevice) {
      // Process as payment
      if (!amount || amount <= 0) {
        throw new Error('Amount is required for payment devices');
      }

      const paymentResult = await processPayment(
        cardUID,
        amount,
        deviceId,
        deviceLocation,
        description
      );

      return {
        type: 'payment',
        success: true,
        data: paymentResult
      };
    } else if (isAttendanceDevice) {
      // Process as attendance
      const attendanceResult = await recordAttendance(
        cardUID,
        deviceId,
        deviceLocation
      );

      return {
        type: 'attendance',
        success: true,
        data: attendanceResult
      };
    } else {
      throw new Error(`Device type ${device.deviceType} is not supported for card taps`);
    }

  } catch (error: any) {
    console.error('Error handling card tap:', error.message);
    throw error;
  }
}

// Check device type and return appropriate action
export async function getDeviceAction(deviceId: string) {
  try {
    const device = await Device.findOne({ deviceId });
    if (!device) {
      throw new Error('Device not found');
    }

    const isPaymentDevice = ['pos', 'canteen_reader'].includes(device.deviceType);
    const isAttendanceDevice = ['esp32', 'rfid_reader', 'attendance_reader'].includes(device.deviceType);

    return {
      deviceId: device.deviceId,
      deviceType: device.deviceType,
      deviceName: device.name,
      isPaymentDevice,
      isAttendanceDevice,
      action: isPaymentDevice ? 'payment' : isAttendanceDevice ? 'attendance' : 'unknown',
      merchantId: device.merchantId || null
    };
  } catch (error: any) {
    throw new Error(`Error getting device action: ${error.message}`);
  }
}


