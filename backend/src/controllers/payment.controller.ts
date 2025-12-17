import { processPayment, getTransactionHistory, getAccountBalance } from '../functions/payment.js';
import { generatePaymentReceipt, generatePaymentConfirmation } from '../functions/receipt.js';
import { Student } from '../models/student.js';
import { Transaction } from '../models/transaction.js';
import { Merchant } from '../models/merchant.js';

// Process payment when card is tapped at POS device
export async function processPaymentController(req: any, res: any) {
  try {
    const { cardUID, amount, deviceId, deviceLocation, description } = req.body;

    // Validation
    if (!cardUID || !amount || !deviceId || !deviceLocation) {
      return res.status(400).json({
        success: false,
        message: 'Please provide cardUID, amount, deviceId, and deviceLocation'
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than zero'
      });
    }

    const result = await processPayment(
      cardUID,
      amount,
      deviceId,
      deviceLocation,
      description
    );

    // Generate payment confirmation
    if (result.transaction && result.transaction.id) {
      const transaction = await Transaction.findById(result.transaction.id)
        .populate('studentId', 'firstName lastName studentId')
        .populate('merchantId', 'name type');
      
      if (transaction && transaction.studentId && transaction.merchantId) {
        const confirmation = generatePaymentConfirmation(
          transaction,
          transaction.studentId as any,
          transaction.merchantId as any
        );
        result.confirmation = confirmation.confirmation;
      }
    }

    res.status(200).json({
      success: true,
      message: 'Payment processed successfully',
      data: result
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

// Get transaction history for a student
export async function getTransactionHistoryController(req: any, res: any) {
  try {
    const { studentId } = req.params;
    const { startDate, endDate, limit } = req.query;

    // Verify student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const result = await getTransactionHistory(
      studentId,
      startDate as string,
      endDate as string,
      limit ? parseInt(limit as string) : 50
    );

    res.status(200).json({
      success: true,
      message: 'Transaction history retrieved successfully',
      data: result
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

// Get account balance for a student
export async function getAccountBalanceController(req: any, res: any) {
  try {
    const { studentId } = req.params;

    // Verify student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const result = await getAccountBalance(studentId);

    res.status(200).json({
      success: true,
      message: 'Account balance retrieved successfully',
      data: result
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

// Get merchant sales
export async function getMerchantSalesController(req: any, res: any) {
  try {
    const { merchantId } = req.params;
    const { startDate, endDate } = req.query;

    const { Merchant } = await import('../models/merchant.js');
    const { Transaction } = await import('../models/transaction.js');

    const merchant = await Merchant.findById(merchantId);
    if (!merchant) {
      return res.status(404).json({
        success: false,
        message: 'Merchant not found'
      });
    }

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
      message: 'Merchant sales retrieved successfully',
      data: {
        merchant: {
          id: merchant._id,
          name: merchant.name,
          type: merchant.type
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

// Get payment receipt
export async function getPaymentReceiptController(req: any, res: any) {
  try {
    const { transactionId } = req.params;

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Check access permissions
    if (req.user.role === 'parent') {
      const student = await Student.findById(transaction.studentId);
      if (student && student.parentId.toString() !== req.user.parentId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
    } else if (req.user.role === 'school') {
      const student = await Student.findById(transaction.studentId);
      if (student && student.schoolId.toString() !== req.user.schoolId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
    }

    const pdfBuffer = await generatePaymentReceipt(transactionId);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=receipt_${transaction.reference}.pdf`);
    res.send(pdfBuffer);

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

// Refund a transaction
export async function refundTransactionController(req: any, res: any) {
  try {
    const { transactionId } = req.params;
    const { reason } = req.body;

    const { Transaction } = await import('../models/transaction.js');

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    if (transaction.type !== 'purchase') {
      return res.status(400).json({
        success: false,
        message: 'Only purchase transactions can be refunded'
      });
    }

    if (transaction.status === 'reversed') {
      return res.status(400).json({
        success: false,
        message: 'Transaction already reversed'
      });
    }

    const reversal = await transaction.reverse(reason);

    res.status(200).json({
      success: true,
      message: 'Transaction refunded successfully',
      data: {
        originalTransaction: {
          id: transaction._id,
          reference: transaction.reference,
          amount: transaction.amount
        },
        reversal: {
          id: reversal._id,
          reference: reversal.reference,
          amount: reversal.amount
        }
      }
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}


