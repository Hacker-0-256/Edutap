import { Merchant } from '../models/merchant.js';
import { School } from '../models/school.js';

// Create a new merchant
export async function createMerchantController(req: any, res: any) {
  try {
    const {
      name,
      type,
      schoolId,
      location,
      contact,
      operatingHours
    } = req.body;

    // Validation
    if (!name || !type || !schoolId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, type, and schoolId'
      });
    }

    // Verify school exists
    const school = await School.findById(schoolId);
    if (!school) {
      return res.status(404).json({
        success: false,
        message: 'School not found'
      });
    }

    // Check access (admin or school staff for their school)
    if (req.user.role === 'school' && req.user.schoolId.toString() !== schoolId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Cannot create merchant for another school'
      });
    }

    const merchant = await Merchant.create({
      name,
      type,
      schoolId,
      location: location || {},
      contact: contact || {},
      operatingHours: operatingHours || {}
    });

    res.status(201).json({
      success: true,
      message: 'Merchant created successfully',
      data: merchant
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

// Get all merchants for a school
export async function getMerchantsController(req: any, res: any) {
  try {
    const { schoolId } = req.params;

    // Check access
    if (req.user.role === 'school' && req.user.schoolId.toString() !== schoolId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: School mismatch'
      });
    }

    const merchants = await Merchant.find({ schoolId, isActive: true });

    res.status(200).json({
      success: true,
      count: merchants.length,
      data: merchants
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

// Get a single merchant
export async function getMerchantController(req: any, res: any) {
  try {
    const { merchantId } = req.params;

    const merchant = await Merchant.findById(merchantId)
      .populate('schoolId', 'name');

    if (!merchant) {
      return res.status(404).json({
        success: false,
        message: 'Merchant not found'
      });
    }

    // Check access
    if (req.user.role === 'school' && merchant.schoolId._id.toString() !== req.user.schoolId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Merchant does not belong to your school'
      });
    }

    res.status(200).json({
      success: true,
      data: merchant
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

// Update a merchant
export async function updateMerchantController(req: any, res: any) {
  try {
    const { merchantId } = req.params;

    const merchant = await Merchant.findById(merchantId);
    if (!merchant) {
      return res.status(404).json({
        success: false,
        message: 'Merchant not found'
      });
    }

    // Check access
    if (req.user.role === 'school' && merchant.schoolId.toString() !== req.user.schoolId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Merchant does not belong to your school'
      });
    }

    const updatedMerchant = await Merchant.findByIdAndUpdate(
      merchantId,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Merchant updated successfully',
      data: updatedMerchant
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

// Delete (deactivate) a merchant
export async function deleteMerchantController(req: any, res: any) {
  try {
    const { merchantId } = req.params;

    const merchant = await Merchant.findById(merchantId);
    if (!merchant) {
      return res.status(404).json({
        success: false,
        message: 'Merchant not found'
      });
    }

    // Check access
    if (req.user.role === 'school' && merchant.schoolId.toString() !== req.user.schoolId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Merchant does not belong to your school'
      });
    }

    const updatedMerchant = await Merchant.findByIdAndUpdate(
      merchantId,
      { isActive: false },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Merchant deactivated successfully'
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

// Get merchant sales report
export async function getMerchantSalesController(req: any, res: any) {
  try {
    const { merchantId } = req.params;
    const { startDate, endDate } = req.query;

    const merchant = await Merchant.findById(merchantId);
    if (!merchant) {
      return res.status(404).json({
        success: false,
        message: 'Merchant not found'
      });
    }

    // Check access
    if (req.user.role === 'school' && merchant.schoolId.toString() !== req.user.schoolId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Merchant does not belong to your school'
      });
    }

    const { Transaction } = await import('../models/transaction.js');

    // Build query
    const query: any = {
      merchantId,
      type: 'purchase',
      status: 'completed'
    };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }

    const transactions = await Transaction.find(query)
      .sort({ timestamp: -1 })
      .populate('studentId', 'firstName lastName studentId')
      .populate('accountId');

    // Calculate totals
    const totalSales = transactions.reduce((sum, txn) => sum + txn.amount, 0);
    const totalTransactions = transactions.length;
    const averageTransaction = totalTransactions > 0 ? totalSales / totalTransactions : 0;

    res.status(200).json({
      success: true,
      message: 'Merchant sales report retrieved successfully',
      data: {
        merchant: {
          id: merchant._id,
          name: merchant.name,
          type: merchant.type
        },
        period: {
          startDate: startDate || 'all',
          endDate: endDate || 'all'
        },
        summary: {
          totalSales,
          totalTransactions,
          averageTransaction: Math.round(averageTransaction * 100) / 100
        },
        transactions: transactions.map(txn => ({
          id: txn._id,
          reference: txn.reference,
          amount: txn.amount,
          student: txn.studentId ? {
            name: `${(txn.studentId as any).firstName} ${(txn.studentId as any).lastName}`,
            studentId: (txn.studentId as any).studentId
          } : null,
          timestamp: txn.timestamp,
          date: txn.date
        }))
      }
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}


