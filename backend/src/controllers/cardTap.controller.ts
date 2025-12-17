import { handleCardTap, getDeviceAction } from '../functions/cardTap.js';

// Unified card tap endpoint - automatically routes to attendance or payment
export async function cardTapController(req: any, res: any) {
  try {
    const { cardUID, deviceId, deviceLocation, amount, description } = req.body;

    // Validation
    if (!cardUID || !deviceId || !deviceLocation) {
      return res.status(400).json({
        success: false,
        message: 'Please provide cardUID, deviceId, and deviceLocation'
      });
    }

    // Handle card tap (will route to attendance or payment)
    const result = await handleCardTap(
      cardUID,
      deviceId,
      deviceLocation,
      amount,
      description
    );

    res.status(200).json({
      success: true,
      message: `${result.type === 'payment' ? 'Payment' : 'Attendance'} processed successfully`,
      data: result
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

// Get device action type (for device configuration)
export async function getDeviceActionController(req: any, res: any) {
  try {
    const { deviceId } = req.params;

    if (!deviceId) {
      return res.status(400).json({
        success: false,
        message: 'deviceId is required'
      });
    }

    const result = await getDeviceAction(deviceId);

    res.status(200).json({
      success: true,
      message: 'Device action retrieved successfully',
      data: result
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}


