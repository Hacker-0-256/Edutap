import { School } from '../models/school.js';
import { DeviceLog } from '../models/deviceLog.js';
import { User } from '../models/user.js';

// Admin controller for managing schools and logs

// Create a new school
export async function createSchool(req: any, res: any) {
  try {
    const { name, address, phone, email, openingTime, closingTime } = req.body;

    // Simple validation
    if (!name || !address || !phone || !email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Create school
    const school = await School.create({
      name,
      address,
      phone,
      email,
      openingTime,
      closingTime
    });

    res.status(201).json({
      success: true,
      message: 'School created successfully',
      data: school
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

// Get all schools
export async function getSchools(req: any, res: any) {
  try {
    const schools = await School.find({ isActive: true });

    res.status(200).json({
      success: true,
      count: schools.length,
      data: schools
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

// Get a single school
export async function getSchool(req: any, res: any) {
  try {
    const school = await School.findById(req.params.id);

    if (!school) {
      return res.status(404).json({
        success: false,
        message: 'School not found'
      });
    }

    res.status(200).json({
      success: true,
      data: school
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

// Update a school
export async function updateSchool(req: any, res: any) {
  try {
    const school = await School.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!school) {
      return res.status(404).json({
        success: false,
        message: 'School not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'School updated successfully',
      data: school
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

// Delete (deactivate) a school
export async function deleteSchool(req: any, res: any) {
  try {
    const school = await School.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!school) {
      return res.status(404).json({
        success: false,
        message: 'School not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'School deactivated successfully'
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

// Get system-wide logs
export async function getSystemLogs(req: any, res: any) {
  try {
    const { limit = 100, eventType, severity, startDate, endDate, schoolId } = req.query;

    // Build query
    const query: any = {};

    if (schoolId) query.schoolId = schoolId;
    if (eventType) query.eventType = eventType;
    if (severity) query.severity = severity;
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate as string);
      if (endDate) query.timestamp.$lte = new Date(endDate as string);
    }

    const logs = await DeviceLog.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit as string))
      .populate('deviceId', 'deviceId name deviceType')
      .populate('schoolId', 'name');

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

// Get log statistics across all schools
export async function getLogStats(req: any, res: any) {
  try {
    const { days = 30 } = req.query;

    const since = new Date(Date.now() - (parseInt(days as string) * 24 * 60 * 60 * 1000));

    const stats = await DeviceLog.aggregate([
      {
        $match: {
          timestamp: { $gte: since }
        }
      },
      {
        $group: {
          _id: {
            eventType: '$eventType',
            severity: '$severity'
          },
          count: { $sum: 1 },
          lastEvent: { $max: '$timestamp' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

// Delete old logs (cleanup)
export async function cleanupLogs(req: any, res: any) {
  try {
    const { days = 90 } = req.body; // Default 90 days

    const cutoffDate = new Date(Date.now() - (parseInt(days) * 24 * 60 * 60 * 1000));

    const result = await DeviceLog.deleteMany({
      timestamp: { $lt: cutoffDate }
    });

    res.status(200).json({
      success: true,
      message: `Deleted ${result.deletedCount} old log entries`
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

// Get all users (for admin management)
export async function getUsers(req: any, res: any) {
  try {
    const users = await User.find({})
      .select('-password') // Exclude password
      .populate('schoolId', 'name')
      .populate('parentId', 'firstName lastName');

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

// Get all transactions (admin dashboard)
export async function getAllTransactions(req: any, res: any) {
  try {
    const { startDate, endDate, schoolId, merchantId, status, type, limit = 100, page = 1 } = req.query;

    // Build query
    const query: any = {};
    
    if (schoolId) {
      // Get all students for this school, then filter transactions
      const { Student } = await import('../models/student.js');
      const students = await Student.find({ schoolId });
      query.studentId = { $in: students.map(s => s._id) };
    }
    
    if (merchantId) query.merchantId = merchantId;
    if (status) query.status = status;
    if (type) query.type = type;
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }

    const { Transaction } = await import('../models/transaction.js');
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    
    const transactions = await Transaction.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit as string))
      .skip(skip)
      .populate('studentId', 'firstName lastName studentId grade class')
      .populate('merchantId', 'name type')
      .populate('accountId');

    const total = await Transaction.countDocuments(query);

    // Calculate summary statistics
    const summary = await Transaction.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$amount' },
          totalTransactions: { $sum: 1 },
          averageAmount: { $avg: '$amount' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        transactions: transactions.map(txn => ({
          id: txn._id,
          reference: txn.reference,
          type: txn.type,
          amount: txn.amount,
          status: txn.status,
          student: txn.studentId ? {
            name: `${(txn.studentId as any).firstName} ${(txn.studentId as any).lastName}`,
            studentId: (txn.studentId as any).studentId,
            grade: (txn.studentId as any).grade,
            class: (txn.studentId as any).class
          } : null,
          merchant: txn.merchantId ? {
            name: (txn.merchantId as any).name,
            type: (txn.merchantId as any).type
          } : null,
          balanceAfter: txn.balanceAfter,
          timestamp: txn.timestamp,
          date: txn.date
        })),
        summary: summary[0] || {
          totalRevenue: 0,
          totalTransactions: 0,
          averageAmount: 0
        },
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          pages: Math.ceil(total / parseInt(limit as string))
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

// Get sales analytics (admin dashboard)
export async function getSalesAnalytics(req: any, res: any) {
  try {
    const { startDate, endDate, schoolId, groupBy = 'day' } = req.query;

    const { Transaction } = await import('../models/transaction.js');
    const { Merchant } = await import('../models/merchant.js');

    // Build match query
    const matchQuery: any = {
      type: 'purchase',
      status: 'completed'
    };

    if (schoolId) {
      const { Student } = await import('../models/student.js');
      const students = await Student.find({ schoolId });
      matchQuery.studentId = { $in: students.map(s => s._id) };
    }

    if (startDate || endDate) {
      matchQuery.date = {};
      if (startDate) matchQuery.date.$gte = startDate;
      if (endDate) matchQuery.date.$lte = endDate;
    }

    // Group by date
    let groupFormat: any = {};
    if (groupBy === 'day') {
      groupFormat = { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } };
    } else if (groupBy === 'month') {
      groupFormat = { $dateToString: { format: '%Y-%m', date: '$timestamp' } };
    } else if (groupBy === 'week') {
      groupFormat = { $dateToString: { format: '%Y-W%V', date: '$timestamp' } };
    }

    const salesByDate = await Transaction.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: groupFormat,
          totalRevenue: { $sum: '$amount' },
          transactionCount: { $sum: 1 },
          averageAmount: { $avg: '$amount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Sales by merchant
    const salesByMerchant = await Transaction.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$merchantId',
          totalRevenue: { $sum: '$amount' },
          transactionCount: { $sum: 1 },
          averageAmount: { $avg: '$amount' }
        }
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 10 }
    ]);

    // Populate merchant names
    const merchantIds = salesByMerchant.map((s: any) => s._id).filter(Boolean);
    const merchants = await Merchant.find({ _id: { $in: merchantIds } });
    const merchantMap = new Map(merchants.map((m: any) => [m._id.toString(), m]));

    const salesByMerchantWithNames = salesByMerchant.map((s: any) => ({
      merchant: s._id ? {
        id: s._id,
        name: merchantMap.get(s._id.toString())?.name || 'Unknown',
        type: merchantMap.get(s._id.toString())?.type || 'Unknown'
      } : null,
      totalRevenue: s.totalRevenue,
      transactionCount: s.transactionCount,
      averageAmount: Math.round(s.averageAmount * 100) / 100
    }));

    // Overall summary
    const overallSummary = await Transaction.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$amount' },
          totalTransactions: { $sum: 1 },
          averageAmount: { $avg: '$amount' },
          minAmount: { $min: '$amount' },
          maxAmount: { $max: '$amount' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        salesByDate: salesByDate.map((s: any) => ({
          date: s._id,
          totalRevenue: s.totalRevenue,
          transactionCount: s.transactionCount,
          averageAmount: Math.round(s.averageAmount * 100) / 100
        })),
        salesByMerchant: salesByMerchantWithNames,
        overallSummary: overallSummary[0] || {
          totalRevenue: 0,
          totalTransactions: 0,
          averageAmount: 0,
          minAmount: 0,
          maxAmount: 0
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

// Get account summaries (admin dashboard)
export async function getAccountSummaries(req: any, res: any) {
  try {
    const { schoolId, minBalance, maxBalance, status } = req.query;

    const { Account } = await import('../models/account.js');
    const { Student } = await import('../models/student.js');

    // Build query
    const query: any = { isActive: true };
    
    if (schoolId) {
      const students = await Student.find({ schoolId });
      query.studentId = { $in: students.map(s => s._id) };
    }
    
    if (minBalance !== undefined || maxBalance !== undefined) {
      query.balance = {};
      if (minBalance !== undefined) query.balance.$gte = parseFloat(minBalance as string);
      if (maxBalance !== undefined) query.balance.$lte = parseFloat(maxBalance as string);
    }

    const accounts = await Account.find(query)
      .populate('studentId', 'firstName lastName studentId grade class schoolId')
      .sort({ balance: -1 });

    // Calculate statistics
    const stats = await Account.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalBalance: { $sum: '$balance' },
          accountCount: { $sum: 1 },
          averageBalance: { $avg: '$balance' },
          minBalance: { $min: '$balance' },
          maxBalance: { $max: '$balance' }
        }
      }
    ]);

    // Filter by status if provided
    let filteredAccounts = accounts;
    if (status === 'low') {
      filteredAccounts = accounts.filter((acc: any) => acc.balance < 500);
    } else if (status === 'very_low') {
      filteredAccounts = accounts.filter((acc: any) => acc.balance < 100);
    }

    res.status(200).json({
      success: true,
      data: {
        accounts: filteredAccounts.map((acc: any) => ({
          id: acc._id,
          balance: acc.balance,
          currency: acc.currency,
          student: acc.studentId ? {
            name: `${(acc.studentId as any).firstName} ${(acc.studentId as any).lastName}`,
            studentId: (acc.studentId as any).studentId,
            grade: (acc.studentId as any).grade,
            class: (acc.studentId as any).class
          } : null,
          lastTopUp: acc.lastTopUp,
          isActive: acc.isActive
        })),
        statistics: stats[0] || {
          totalBalance: 0,
          accountCount: 0,
          averageBalance: 0,
          minBalance: 0,
          maxBalance: 0
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

// Get revenue reports (admin dashboard)
export async function getRevenueReports(req: any, res: any) {
  try {
    const { startDate, endDate, schoolId, period = 'day' } = req.query;

    const { Transaction } = await import('../models/transaction.js');

    // Build match query
    const matchQuery: any = {
      type: { $in: ['purchase', 'top-up'] },
      status: 'completed'
    };

    if (schoolId) {
      const { Student } = await import('../models/student.js');
      const students = await Student.find({ schoolId });
      matchQuery.studentId = { $in: students.map(s => s._id) };
    }

    if (startDate || endDate) {
      matchQuery.date = {};
      if (startDate) matchQuery.date.$gte = startDate;
      if (endDate) matchQuery.date.$lte = endDate;
    }

    // Group by period
    let groupFormat: any = {};
    if (period === 'day') {
      groupFormat = { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } };
    } else if (period === 'month') {
      groupFormat = { $dateToString: { format: '%Y-%m', date: '$timestamp' } };
    } else if (period === 'week') {
      groupFormat = { $dateToString: { format: '%Y-W%V', date: '$timestamp' } };
    }

    const revenueByPeriod = await Transaction.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: {
            period: groupFormat,
            type: '$type'
          },
          totalAmount: { $sum: '$amount' },
          transactionCount: { $sum: 1 }
        }
      },
      { $sort: { '_id.period': 1 } }
    ]);

    // Separate purchases and top-ups
    const purchases = revenueByPeriod.filter((r: any) => r._id.type === 'purchase');
    const topUps = revenueByPeriod.filter((r: any) => r._id.type === 'top-up');

    // Overall totals
    const totals = await Transaction.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$type',
          totalAmount: { $sum: '$amount' },
          transactionCount: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        revenueByPeriod: {
          purchases: purchases.map((p: any) => ({
            period: p._id.period,
            totalRevenue: p.totalAmount,
            transactionCount: p.transactionCount
          })),
          topUps: topUps.map((t: any) => ({
            period: t._id.period,
            totalAmount: t.totalAmount,
            transactionCount: t.transactionCount
          }))
        },
        totals: {
          purchases: totals.find((t: any) => t._id === 'purchase') || { totalAmount: 0, transactionCount: 0 },
          topUps: totals.find((t: any) => t._id === 'top-up') || { totalAmount: 0, transactionCount: 0 },
          netRevenue: (totals.find((t: any) => t._id === 'purchase')?.totalAmount || 0) - 
                      (totals.find((t: any) => t._id === 'top-up')?.totalAmount || 0)
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