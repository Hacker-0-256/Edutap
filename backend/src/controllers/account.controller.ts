import { getAccountBalance, getTransactionHistory, addBalance, deductBalance } from '../functions/payment.js';
import { Account } from '../models/account.js';
import { Student } from '../models/student.js';

// Get account balance for a student
export async function getBalanceController(req: any, res: any) {
  try {
    const { studentId } = req.params;
    const user = req.user; // From auth middleware

    // Verify student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Check access permissions
    if (user.role === 'parent' && student.parentId.toString() !== user.parentId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Student does not belong to you'
      });
    }

    if (user.role === 'school' && student.schoolId.toString() !== user.schoolId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Student does not belong to your school'
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

// Get transactions for a student account
export async function getTransactionsController(req: any, res: any) {
  try {
    const { studentId } = req.params;
    const { startDate, endDate, limit } = req.query;
    const user = req.user; // From auth middleware

    // Verify student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Check access permissions
    if (user.role === 'parent' && student.parentId.toString() !== user.parentId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Student does not belong to you'
      });
    }

    if (user.role === 'school' && student.schoolId.toString() !== user.schoolId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Student does not belong to your school'
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
      message: 'Transactions retrieved successfully',
      data: result
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

// Manual balance adjustment (admin/school staff only)
export async function adjustBalanceController(req: any, res: any) {
  try {
    const { studentId } = req.params;
    const { amount, reason, type } = req.body; // type: 'add' or 'deduct'

    // Only admin and school staff can adjust balances
    if (req.user.role !== 'admin' && req.user.role !== 'school') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Only admin and school staff can adjust balances'
      });
    }

    if (!amount || !reason || !type) {
      return res.status(400).json({
        success: false,
        message: 'Please provide amount, reason, and type (add/deduct)'
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than zero'
      });
    }

    if (!['add', 'deduct'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Type must be either "add" or "deduct"'
      });
    }

    // Verify student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Check school access for school staff
    if (req.user.role === 'school' && student.schoolId.toString() !== req.user.schoolId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Student does not belong to your school'
      });
    }

    // Get or create account
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

    let newBalance: number;
    if (type === 'add') {
      await addBalance(studentId, amount);
      newBalance = account.balance + amount;
    } else {
      await deductBalance(studentId, amount);
      newBalance = account.balance - amount;
    }

    // Create adjustment transaction
    const { Transaction } = await import('../models/transaction.js');
    await Transaction.create({
      studentId: student._id,
      accountId: account._id,
      type: 'adjustment',
      amount: type === 'add' ? amount : -amount,
      balanceBefore: account.balance - (type === 'add' ? amount : -amount),
      balanceAfter: newBalance,
      description: `Manual adjustment: ${reason}`,
      status: 'completed',
      date: new Date().toISOString().split('T')[0]
    });

    res.status(200).json({
      success: true,
      message: `Balance ${type === 'add' ? 'added' : 'deducted'} successfully`,
      data: {
        studentId,
        amount,
        type,
        reason,
        newBalance
      }
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

// Get account summary for a school (admin/school staff)
export async function getSchoolAccountSummaryController(req: any, res: any) {
  try {
    const { schoolId } = req.params;

    // Check access
    if (req.user.role === 'school' && req.user.schoolId.toString() !== schoolId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: School mismatch'
      });
    }

    // Get all students for the school
    const students = await Student.find({ schoolId, isActive: true });
    const studentIds = students.map(s => s._id);

    // Get all accounts for these students
    const accounts = await Account.find({ studentId: { $in: studentIds }, isActive: true });

    // Calculate totals
    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    const totalAccounts = accounts.length;
    const accountsWithBalance = accounts.filter(acc => acc.balance > 0).length;
    const totalDeposits = accounts.reduce((sum, acc) => sum + (acc.stats?.totalDeposits || 0), 0);
    const totalWithdrawals = accounts.reduce((sum, acc) => sum + (acc.stats?.totalWithdrawals || 0), 0);

    res.status(200).json({
      success: true,
      message: 'School account summary retrieved successfully',
      data: {
        schoolId,
        summary: {
          totalAccounts,
          accountsWithBalance,
          totalBalance,
          totalDeposits,
          totalWithdrawals,
          netBalance: totalDeposits - totalWithdrawals
        },
        accounts: accounts.map(acc => ({
          studentId: acc.studentId,
          balance: acc.balance,
          currency: acc.currency
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


