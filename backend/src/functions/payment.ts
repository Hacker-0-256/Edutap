import { Student } from '../models/student.js';
import { Account } from '../models/account.js';
import { Transaction } from '../models/transaction.js';
import { Merchant } from '../models/merchant.js';
import { Device } from '../models/device.js';
import { DeviceLog } from '../models/deviceLog.js';
import { Parent } from '../models/parent.js';
import { sendSMS } from './sms.js';

// Validate if student has sufficient balance
export async function validateBalance(studentId: string, amount: number) {
  try {
    const account = await Account.findOne({ studentId, isActive: true });
    
    if (!account) {
      throw new Error('Account not found or inactive');
    }
    
    // Check balance directly
    if (account.balance < amount) {
      return {
        valid: false,
        balance: account.balance,
        required: amount,
        shortfall: amount - account.balance
      };
    }
    
    return {
      valid: true,
      balance: account.balance,
      required: amount
    };
  } catch (error: any) {
    throw new Error(`Balance validation failed: ${error.message}`);
  }
}

// Deduct balance from student account
export async function deductBalance(studentId: string, amount: number) {
  try {
    const account = await Account.findOne({ studentId, isActive: true });
    
    if (!account) {
      throw new Error('Account not found or inactive');
    }
    
    // Check balance directly
    if (account.balance < amount) {
      throw new Error(`Insufficient balance. Available: ${account.balance}, Required: ${amount}`);
    }
    
    // Use the model method (it saves internally)
    await (account as any).deductBalance(amount);
    
    // Reload to get updated balance
    const updatedAccount = await Account.findById(account._id);
    
    return {
      success: true,
      newBalance: updatedAccount?.balance || account.balance,
      amountDeducted: amount
    };
  } catch (error: any) {
    throw new Error(`Balance deduction failed: ${error.message}`);
  }
}

// Add balance to student account
export async function addBalance(studentId: string, amount: number, method?: string) {
  try {
    const account = await Account.findOne({ studentId, isActive: true });
    
    if (!account) {
      throw new Error('Account not found or inactive');
    }
    
    // Use the model method
    await (account as any).addBalance(amount, method);
    
    // Reload to get updated balance
    const updatedAccount = await Account.findById(account._id);
    
    return {
      success: true,
      newBalance: updatedAccount?.balance || account.balance,
      amountAdded: amount
    };
  } catch (error: any) {
    throw new Error(`Balance addition failed: ${error.message}`);
  }
}

// Process payment when student taps card at POS device
export async function processPayment(
  cardUID: string,
  amount: number,
  deviceId: string,
  deviceLocation: string,
  description?: string
) {
  try {
    // 1. Find student by card UID
    const student = await Student.findOne({ cardUID, isActive: true });
    if (!student) {
      throw new Error('Student not found or card is not active');
    }
    
    // 2. Check card status
    if (student.cardStatus !== 'active') {
      throw new Error(`Card is ${student.cardStatus}. Cannot process payment.`);
    }
    
    // 3. Find and validate device
    const device = await Device.findOne({ deviceId });
    if (!device) {
      throw new Error('Device not found');
    }
    
    // 4. Check if device is a POS/canteen device
    if (!['pos', 'canteen_reader'].includes(device.deviceType)) {
      throw new Error('Device is not a payment device');
    }
    
    // 5. Get merchant from device
    const merchant = device.merchantId 
      ? await Merchant.findById(device.merchantId)
      : null;
    
    if (!merchant || !merchant.isActive) {
      throw new Error('Merchant not found or inactive');
    }
    
    // 6. Get or create account
    let account = await Account.findOne({ studentId: student._id });
    if (!account) {
      // Create account if it doesn't exist
      account = await Account.create({
        studentId: student._id,
        balance: 0,
        currency: 'RWF'
      });
      
      // Update student with account reference
      student.accountId = account._id;
      await student.save();
    }
    
    // 7. Validate balance
    const balanceCheck = await validateBalance(student._id.toString(), amount);
    if (!balanceCheck.valid) {
      // Log failed transaction
      await (DeviceLog as any).logEvent(
        device._id,
        device.schoolId,
        'scan_failure',
        `Payment failed: Insufficient balance for ${student.firstName} ${student.lastName}`,
        {
          cardUID,
          studentId: student._id,
          amount,
          balance: balanceCheck.balance,
          shortfall: balanceCheck.shortfall
        },
        'medium'
      );
      
      throw new Error(`Insufficient balance. Available: ${balanceCheck.balance} RWF, Required: ${amount} RWF`);
    }
    
    // 8. Check for duplicate transaction (idempotency)
    // Prevent duplicate charges if same card is tapped multiple times quickly
    const recentTransaction = await Transaction.findOne({
      studentId: student._id,
      merchantId: merchant._id,
      deviceId: deviceId,
      amount: amount,
      status: 'completed',
      timestamp: { $gte: new Date(Date.now() - 5000) } // Within last 5 seconds
    });

    if (recentTransaction) {
      // Return existing transaction instead of creating duplicate
      return {
        success: true,
        transaction: {
          id: recentTransaction._id,
          reference: recentTransaction.reference,
          amount: recentTransaction.amount,
          balanceAfter: recentTransaction.balanceAfter,
          timestamp: recentTransaction.timestamp,
          duplicate: true
        },
        student: {
          name: `${student.firstName} ${student.lastName}`,
          studentId: student.studentId
        },
        merchant: {
          name: merchant.name,
          type: merchant.type
        }
      };
    }

    // 9. Create transaction (this will deduct balance)
    const transaction = await (Transaction as any).createPurchase(
      student._id,
      account._id,
      amount,
      merchant._id,
      deviceId,
      deviceLocation,
      description || `Purchase at ${merchant.name}`
    );
    
    // 10. Update merchant sales statistics
    await (merchant as any).updateSales(amount);
    
    // 11. Update device statistics
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
    
    // 12. Log successful transaction
    await (DeviceLog as any).logEvent(
      device._id,
      device.schoolId,
      'scan_success',
      `Payment successful: ${student.firstName} ${student.lastName} - ${amount} RWF`,
      {
        cardUID,
        studentId: student._id,
        transactionId: transaction._id,
        amount,
        merchantId: merchant._id
      },
      'low'
    );

    // 13. Send SMS notification to parent (optional)
    let smsResult: { success: boolean; error?: string } = { success: false };
    try {
      const parent = await Parent.findById(student.parentId);
      if (parent && parent.receiveSMS && parent.phone) {
        const timeString = new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
        const dateString = new Date().toISOString().substring(0, 10);
        
        const message = `Hello ${parent.firstName}, ${student.firstName} ${student.lastName} made a purchase of ${amount} RWF at ${merchant.name} on ${dateString} at ${timeString}. New balance: ${transaction.balanceAfter} RWF.`;
        
        const smsResponse = await sendSMS(parent.phone, message);
        smsResult = {
          success: smsResponse.success,
          error: smsResponse.success ? undefined : smsResponse.error
        };
      }
    } catch (smsError: any) {
      console.error('Error sending payment SMS notification:', smsError.message);
      smsResult = {
        success: false,
        error: smsError.message
      };
    }
    
    // Get photo URL helper
    const { getPhotoUrl } = await import('../middleware/upload.middleware.js');
    
    return {
      success: true,
      transaction: {
        id: transaction._id,
        reference: transaction.reference,
        amount: transaction.amount,
        balanceAfter: transaction.balanceAfter,
        timestamp: transaction.timestamp
      },
      student: {
        id: student._id,
        name: `${student.firstName} ${student.lastName}`,
        firstName: student.firstName,
        lastName: student.lastName,
        studentId: student.studentId,
        grade: student.grade,
        class: student.class,
        photo: getPhotoUrl(student.photo), // Include photo URL
        accountBalance: transaction.balanceAfter
      },
      merchant: {
        name: merchant.name,
        type: merchant.type
      },
      newBalance: transaction.balanceAfter
    };
    
  } catch (error: any) {
    console.error('Error processing payment:', error.message);
    throw error;
  }
}

// Get transaction history for a student
export async function getTransactionHistory(
  studentId: string,
  startDate?: string,
  endDate?: string,
  limit: number = 50
) {
  try {
    const query: any = { studentId };
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }
    
    const transactions = await Transaction.find(query)
      .sort({ timestamp: -1 })
      .limit(limit)
      .populate('merchantId', 'name type')
      .populate('studentId', 'firstName lastName studentId');
    
    return {
      success: true,
      count: transactions.length,
      transactions: transactions.map(txn => ({
        id: txn._id,
        reference: txn.reference,
        type: txn.type,
        amount: txn.amount,
        balanceAfter: txn.balanceAfter,
        merchant: txn.merchantId ? {
          name: (txn.merchantId as any).name,
          type: (txn.merchantId as any).type
        } : null,
        description: txn.description,
        status: txn.status,
        timestamp: txn.timestamp,
        date: txn.date
      }))
    };
  } catch (error: any) {
    console.error('Error fetching transaction history:', error.message);
    throw error;
  }
}

// Get account balance for a student
export async function getAccountBalance(studentId: string) {
  try {
    const account = await Account.findOne({ studentId, isActive: true })
      .populate('studentId', 'firstName lastName studentId');
    
    if (!account) {
      return {
        success: false,
        message: 'Account not found',
        balance: 0,
        currency: 'RWF'
      };
    }
    
    return {
      success: true,
      account: {
        balance: account.balance,
        currency: account.currency,
        isActive: account.isActive,
        lastTopUp: account.lastTopUp,
        stats: account.stats
      },
      student: {
        name: `${(account.studentId as any).firstName} ${(account.studentId as any).lastName}`,
        studentId: (account.studentId as any).studentId
      }
    };
  } catch (error: any) {
    console.error('Error fetching account balance:', error.message);
    throw error;
  }
}

