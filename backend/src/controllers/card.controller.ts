import {
  deactivateCard,
  reactivateCard,
  replaceCard,
  getCardStatus,
  validateCardStatus
} from '../functions/card.js';

// Deactivate a card
export async function deactivateCardController(req: any, res: any) {
  try {
    const { cardUID } = req.params;
    const { reason } = req.body;
    const user = req.user; // From auth middleware

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Reason is required (lost, stolen, or other)'
      });
    }

    // Only admin and school staff can deactivate cards
    if (user.role !== 'admin' && user.role !== 'school') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Only admin and school staff can deactivate cards'
      });
    }

    const result = await deactivateCard(cardUID, reason, user.userId);

    res.status(200).json({
      success: true,
      message: 'Card deactivated successfully',
      data: result
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

// Reactivate a card
export async function reactivateCardController(req: any, res: any) {
  try {
    const { cardUID } = req.params;
    const user = req.user; // From auth middleware

    // Only admin and school staff can reactivate cards
    if (user.role !== 'admin' && user.role !== 'school') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Only admin and school staff can reactivate cards'
      });
    }

    const result = await reactivateCard(cardUID);

    res.status(200).json({
      success: true,
      message: 'Card reactivated successfully',
      data: result
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

// Replace a card
export async function replaceCardController(req: any, res: any) {
  try {
    const { cardUID } = req.params;
    const { newCardUID } = req.body;
    const user = req.user; // From auth middleware

    if (!newCardUID) {
      return res.status(400).json({
        success: false,
        message: 'newCardUID is required'
      });
    }

    // Only admin and school staff can replace cards
    if (user.role !== 'admin' && user.role !== 'school') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Only admin and school staff can replace cards'
      });
    }

    const result = await replaceCard(cardUID, newCardUID);

    res.status(200).json({
      success: true,
      message: 'Card replaced successfully',
      data: result
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

// Get card status
export async function getCardStatusController(req: any, res: any) {
  try {
    const { cardUID } = req.params;

    const result = await getCardStatus(cardUID);

    res.status(200).json({
      success: true,
      message: 'Card status retrieved successfully',
      data: result
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

// Validate card status (for device use)
export async function validateCardController(req: any, res: any) {
  try {
    const { cardUID } = req.body;

    if (!cardUID) {
      return res.status(400).json({
        success: false,
        message: 'cardUID is required'
      });
    }

    const isValid = await validateCardStatus(cardUID);

    res.status(200).json({
      success: true,
      data: {
        cardUID,
        isValid
      }
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}


