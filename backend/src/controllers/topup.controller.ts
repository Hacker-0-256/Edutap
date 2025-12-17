import {
  initiateTopUp,
  processTopUp,
  createManualTopUp,
  failTopUp,
  getTopUpHistory,
  getTopUpStatus
} from '../functions/topup.js';

// Initiate a top-up request
export async function initiateTopUpController(req: any, res: any) {
  try {
    const { studentId, amount, paymentMethod } = req.body;
    const { parentId } = req.user; // From auth middleware

    // Validation
    if (!studentId || !amount || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Please provide studentId, amount, and paymentMethod'
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than zero'
      });
    }

    const validPaymentMethods = ['mobile_money', 'bank_transfer', 'cash', 'card', 'other'];
    if (!validPaymentMethods.includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: `Invalid payment method. Must be one of: ${validPaymentMethods.join(', ')}`
      });
    }

    const result = await initiateTopUp(
      parentId,
      studentId,
      amount,
      paymentMethod
    );

    res.status(201).json({
      success: true,
      message: 'Top-up initiated successfully',
      data: result
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

// Process top-up (supports both manual and payment gateway)
// paymentReference is optional for manual processing
export async function processTopUpController(req: any, res: any) {
  try {
    const { topUpId } = req.params;
    const { paymentReference, gatewayResponse } = req.body;
    const { userId } = req.user; // Admin/school staff who is processing

    // paymentReference is optional for manual processing
    // If not provided, it's a manual top-up
    const result = await processTopUp(
      topUpId, 
      paymentReference, // Optional
      gatewayResponse,  // Optional
      userId            // Track who processed it
    );

    res.status(200).json({
      success: true,
      message: 'Top-up processed successfully',
      data: result
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

// Create and process manual top-up in one step (admin/school staff only)
export async function createManualTopUpController(req: any, res: any) {
  try {
    const { studentId, amount, paymentMethod, parentId, paymentReference } = req.body;
    const { userId } = req.user; // Admin/school staff who is processing

    // Validation
    if (!studentId || !amount || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Please provide studentId, amount, and paymentMethod'
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than zero'
      });
    }

    const validPaymentMethods = ['mobile_money', 'bank_transfer', 'cash', 'card', 'other'];
    if (!validPaymentMethods.includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: `Invalid payment method. Must be one of: ${validPaymentMethods.join(', ')}`
      });
    }

    const result = await createManualTopUp(
      studentId,
      amount,
      paymentMethod,
      userId,
      parentId,
      paymentReference
    );

    res.status(201).json({
      success: true,
      message: 'Manual top-up created and processed successfully',
      data: result
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

// Mark top-up as failed
export async function failTopUpController(req: any, res: any) {
  try {
    const { topUpId } = req.params;
    const { errorMessage } = req.body;

    if (!errorMessage) {
      return res.status(400).json({
        success: false,
        message: 'Error message is required'
      });
    }

    const result = await failTopUp(topUpId, errorMessage);

    res.status(200).json({
      success: true,
      message: 'Top-up marked as failed',
      data: result
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

// Get top-up history
export async function getTopUpHistoryController(req: any, res: any) {
  try {
    const { studentId, parentId } = req.query;
    const { limit } = req.query;
    const user = req.user; // From auth middleware

    // If parent role, only show their own top-ups
    let queryParentId = parentId;
    if (user.role === 'parent') {
      queryParentId = user.parentId;
    }

    const result = await getTopUpHistory(
      studentId as string,
      queryParentId as string,
      limit ? parseInt(limit as string) : 50
    );

    res.status(200).json({
      success: true,
      message: 'Top-up history retrieved successfully',
      data: result
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

// Get top-up status
export async function getTopUpStatusController(req: any, res: any) {
  try {
    const { topUpId } = req.params;

    const result = await getTopUpStatus(topUpId);

    res.status(200).json({
      success: true,
      message: 'Top-up status retrieved successfully',
      data: result
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}


