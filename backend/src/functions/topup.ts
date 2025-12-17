import { Student } from '../models/student.js';
import { Account } from '../models/account.js';
import { TopUp } from '../models/topUp.js';
import { Transaction } from '../models/transaction.js';
import { Parent } from '../models/parent.js';

// Initiate a top-up request
export async function initiateTopUp(
  parentId: string,
  studentId: string,
  amount: number,
  paymentMethod: string
) {
  try {
    // 1. Validate parent
    const parent = await Parent.findById(parentId);
    if (!parent || !parent.isActive) {
      throw new Error('Parent not found or inactive');
    }
    
    // 2. Validate student
    const student = await Student.findById(studentId);
    if (!student || !student.isActive) {
      throw new Error('Student not found or inactive');
    }
    
    // 3. Verify parent-student relationship
    if (student.parentId.toString() !== parentId) {
      throw new Error('Student does not belong to this parent');
    }
    
    // 4. Validate amount
    if (amount <= 0) {
      throw new Error('Amount must be greater than zero');
    }
    
    // 5. Get or create account
    let account = await Account.findOne({ studentId: student._id });
    if (!account) {
      account = await Account.create({
        studentId: student._id,
        balance: 0,
        currency: 'RWF'
      });
      
      student.accountId = account._id;
      await student.save();
    }
    
    // 6. Create top-up request
    const topUp = await TopUp.create({
      studentId: student._id,
      accountId: account._id,
      parentId: parent._id,
      amount,
      paymentMethod,
      status: 'pending'
    });
    
    return {
      success: true,
      topUp: {
        id: topUp._id,
        topUpReference: topUp.topUpReference,
        amount: topUp.amount,
        paymentMethod: topUp.paymentMethod,
        status: topUp.status,
        initiatedAt: topUp.initiatedAt
      },
      student: {
        name: `${student.firstName} ${student.lastName}`,
        studentId: student.studentId
      }
    };
  } catch (error: any) {
    console.error('Error initiating top-up:', error.message);
    throw error;
  }
}

// Process top-up (supports both manual and payment gateway)
// paymentReference is optional for manual processing
export async function processTopUp(
  topUpId: string,
  paymentReference?: string,
  gatewayResponse?: any,
  processedBy?: string
) {
  try {
    // 1. Find top-up request
    const topUp = await TopUp.findById(topUpId);
    if (!topUp) {
      throw new Error('Top-up request not found');
    }
    
    // 2. Check if already processed
    if (topUp.status === 'completed') {
      throw new Error('Top-up already completed');
    }
    
    if (topUp.status === 'failed' || topUp.status === 'cancelled') {
      throw new Error(`Top-up is ${topUp.status} and cannot be processed`);
    }
    
    // 3. Mark as processing
    await topUp.markAsProcessing();
    
    try {
      // 4. Get account
      const account = await Account.findById(topUp.accountId);
      if (!account) {
        throw new Error('Account not found');
      }
      
      // 5. Add balance
      await account.addBalance(topUp.amount, topUp.paymentMethod);
      
      // 6. Create transaction record (paymentReference optional for manual)
      await Transaction.createTopUp(
        topUp.studentId,
        topUp.accountId,
        topUp.amount,
        topUp.paymentMethod,
        paymentReference || `MANUAL-${Date.now()}`
      );
      
      // 7. Mark top-up as completed
      await topUp.markAsCompleted(paymentReference, gatewayResponse, processedBy);
      
      return {
        success: true,
        topUp: {
          id: topUp._id,
          topUpReference: topUp.topUpReference,
          amount: topUp.amount,
          status: topUp.status,
          newBalance: account.balance
        }
      };
    } catch (error: any) {
      // Mark as failed if something goes wrong
      await topUp.markAsFailed(error.message);
      throw error;
    }
  } catch (error: any) {
    console.error('Error processing top-up:', error.message);
    throw error;
  }
}

// Create and process manual top-up in one step (for admin/school staff)
export async function createManualTopUp(
  studentId: string,
  amount: number,
  paymentMethod: string,
  processedBy: string,
  parentId?: string,
  paymentReference?: string
) {
  try {
    // 1. Validate student
    const student = await Student.findById(studentId);
    if (!student || !student.isActive) {
      throw new Error('Student not found or inactive');
    }
    
    // 2. Validate amount
    if (amount <= 0) {
      throw new Error('Amount must be greater than zero');
    }
    
    // 3. Get or create account
    let account = await Account.findOne({ studentId: student._id });
    if (!account) {
      account = await Account.create({
        studentId: student._id,
        balance: 0,
        currency: 'RWF'
      });
      
      student.accountId = account._id;
      await student.save();
    }
    
    // 4. Get parent if not provided (use student's parent)
    const finalParentId = parentId || student.parentId;
    
    // 5. Create top-up record
    const topUp = await TopUp.create({
      studentId: student._id,
      accountId: account._id,
      parentId: finalParentId,
      amount,
      paymentMethod,
      status: 'processing', // Start as processing since we'll complete it immediately
      processedBy
    });
    
    // 6. Process immediately (add balance)
    await account.addBalance(amount, paymentMethod);
    
    // 7. Create transaction record
    await Transaction.createTopUp(
      student._id,
      account._id,
      amount,
      paymentMethod,
      paymentReference || `MANUAL-${Date.now()}`
    );
    
    // 8. Mark as completed
    await topUp.markAsCompleted(paymentReference, undefined, processedBy);
    
    return {
      success: true,
      topUp: {
        id: topUp._id,
        topUpReference: topUp.topUpReference,
        amount: topUp.amount,
        paymentMethod: topUp.paymentMethod,
        status: topUp.status,
        processedBy: topUp.processedBy,
        completedAt: topUp.completedAt
      },
      student: {
        name: `${student.firstName} ${student.lastName}`,
        studentId: student.studentId
      },
      account: {
        balanceBefore: account.balance - amount,
        balanceAfter: account.balance
      }
    };
  } catch (error: any) {
    console.error('Error creating manual top-up:', error.message);
    throw error;
  }
}

// Mark top-up as failed
export async function failTopUp(topUpId: string, errorMessage: string) {
  try {
    const topUp = await TopUp.findById(topUpId);
    if (!topUp) {
      throw new Error('Top-up request not found');
    }
    
    await topUp.markAsFailed(errorMessage);
    
    return {
      success: true,
      topUp: {
        id: topUp._id,
        status: topUp.status,
        errorMessage: topUp.errorMessage
      }
    };
  } catch (error: any) {
    console.error('Error failing top-up:', error.message);
    throw error;
  }
}

// Get top-up history
export async function getTopUpHistory(
  studentId?: string,
  parentId?: string,
  limit: number = 50
) {
  try {
    const query: any = {};
    
    if (studentId) {
      query.studentId = studentId;
    }
    
    if (parentId) {
      query.parentId = parentId;
    }
    
    const topUps = await TopUp.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('studentId', 'firstName lastName studentId')
      .populate('parentId', 'firstName lastName');
    
    return {
      success: true,
      count: topUps.length,
      topUps: topUps.map(topUp => ({
        id: topUp._id,
        topUpReference: topUp.topUpReference,
        amount: topUp.amount,
        paymentMethod: topUp.paymentMethod,
        status: topUp.status,
        initiatedAt: topUp.initiatedAt,
        processedAt: topUp.processedAt,
        completedAt: topUp.completedAt,
        errorMessage: topUp.errorMessage,
        student: topUp.studentId ? {
          name: `${(topUp.studentId as any).firstName} ${(topUp.studentId as any).lastName}`,
          studentId: (topUp.studentId as any).studentId
        } : null
      }))
    };
  } catch (error: any) {
    console.error('Error fetching top-up history:', error.message);
    throw error;
  }
}

// Get top-up status
export async function getTopUpStatus(topUpId: string) {
  try {
    const topUp = await TopUp.findById(topUpId)
      .populate('studentId', 'firstName lastName studentId')
      .populate('accountId');
    
    if (!topUp) {
      throw new Error('Top-up request not found');
    }
    
    return {
      success: true,
      topUp: {
        id: topUp._id,
        topUpReference: topUp.topUpReference,
        amount: topUp.amount,
        paymentMethod: topUp.paymentMethod,
        status: topUp.status,
        initiatedAt: topUp.initiatedAt,
        processedAt: topUp.processedAt,
        completedAt: topUp.completedAt,
        errorMessage: topUp.errorMessage,
        student: {
          name: `${(topUp.studentId as any).firstName} ${(topUp.studentId as any).lastName}`,
          studentId: (topUp.studentId as any).studentId
        }
      }
    };
  } catch (error: any) {
    console.error('Error fetching top-up status:', error.message);
    throw error;
  }
}


