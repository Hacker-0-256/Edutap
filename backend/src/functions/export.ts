import * as csvWriter from 'csv-writer';
import PDFDocument from 'pdfkit';
import { Transaction } from '../models/transaction.js';
import { Attendance } from '../models/attendance.js';
import { Merchant } from '../models/merchant.js';
import { Student } from '../models/student.js';
import { School } from '../models/school.js';

// Export attendance data to CSV
export async function exportAttendanceToCSV(
  schoolId?: string,
  startDate?: string,
  endDate?: string
): Promise<string> {
  try {
    const query: any = {};
    
    if (schoolId) query.schoolId = schoolId;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }

    const attendanceRecords = await Attendance.find(query)
      .sort({ timestamp: -1 })
      .populate('studentId', 'firstName lastName studentId grade class')
      .populate('schoolId', 'name');

    // Create CSV writer
    const csvPath = `/tmp/attendance_${Date.now()}.csv`;
    const writer = csvWriter.default.createObjectCsvWriter({
      path: csvPath,
      header: [
        { id: 'date', title: 'Date' },
        { id: 'time', title: 'Time' },
        { id: 'studentName', title: 'Student Name' },
        { id: 'studentId', title: 'Student ID' },
        { id: 'grade', title: 'Grade' },
        { id: 'class', title: 'Class' },
        { id: 'schoolName', title: 'School' },
        { id: 'deviceId', title: 'Device ID' },
        { id: 'location', title: 'Location' },
        { id: 'smsSent', title: 'SMS Sent' }
      ]
    });

    const records = attendanceRecords.map((record: any) => ({
      date: record.date,
      time: new Date(record.timestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }),
      studentName: record.studentId 
        ? `${record.studentId.firstName} ${record.studentId.lastName}`
        : 'N/A',
      studentId: record.studentId?.studentId || 'N/A',
      grade: record.studentId?.grade || 'N/A',
      class: record.studentId?.class || 'N/A',
      schoolName: record.schoolId?.name || 'N/A',
      deviceId: record.deviceId,
      location: record.deviceLocation,
      smsSent: record.smsNotificationSent ? 'Yes' : 'No'
    }));

    await writer.writeRecords(records);
    return csvPath;

  } catch (error: any) {
    throw new Error(`Failed to export attendance: ${error.message}`);
  }
}

// Export transactions to CSV
export async function exportTransactionsToCSV(
  schoolId?: string,
  startDate?: string,
  endDate?: string,
  type?: string
): Promise<string> {
  try {
    const query: any = {};
    
    if (type) query.type = type;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }

    // If schoolId provided, get all students for that school
    if (schoolId) {
      const students = await Student.find({ schoolId });
      query.studentId = { $in: students.map(s => s._id) };
    }

    const transactions = await Transaction.find(query)
      .sort({ timestamp: -1 })
      .populate('studentId', 'firstName lastName studentId grade class')
      .populate('merchantId', 'name type')
      .populate('accountId');

    const csvPath = `/tmp/transactions_${Date.now()}.csv`;
    const writer = csvWriter.default.createObjectCsvWriter({
      path: csvPath,
      header: [
        { id: 'date', title: 'Date' },
        { id: 'time', title: 'Time' },
        { id: 'reference', title: 'Reference' },
        { id: 'type', title: 'Type' },
        { id: 'amount', title: 'Amount (RWF)' },
        { id: 'studentName', title: 'Student Name' },
        { id: 'studentId', title: 'Student ID' },
        { id: 'merchantName', title: 'Merchant' },
        { id: 'balanceBefore', title: 'Balance Before' },
        { id: 'balanceAfter', title: 'Balance After' },
        { id: 'status', title: 'Status' },
        { id: 'description', title: 'Description' }
      ]
    });

    const records = transactions.map((txn: any) => ({
      date: txn.date,
      time: new Date(txn.timestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }),
      reference: txn.reference,
      type: txn.type,
      amount: txn.amount,
      studentName: txn.studentId 
        ? `${txn.studentId.firstName} ${txn.studentId.lastName}`
        : 'N/A',
      studentId: txn.studentId?.studentId || 'N/A',
      merchantName: txn.merchantId?.name || 'N/A',
      balanceBefore: txn.balanceBefore,
      balanceAfter: txn.balanceAfter,
      status: txn.status,
      description: txn.description || 'N/A'
    }));

    await writer.writeRecords(records);
    return csvPath;

  } catch (error: any) {
    throw new Error(`Failed to export transactions: ${error.message}`);
  }
}

// Export sales data to CSV
export async function exportSalesToCSV(
  merchantId?: string,
  schoolId?: string,
  startDate?: string,
  endDate?: string
): Promise<string> {
  try {
    const query: any = {
      type: 'purchase',
      status: 'completed'
    };

    if (merchantId) query.merchantId = merchantId;
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }

    // If schoolId provided, get all students for that school
    if (schoolId) {
      const students = await Student.find({ schoolId });
      query.studentId = { $in: students.map(s => s._id) };
    }

    const transactions = await Transaction.find(query)
      .sort({ timestamp: -1 })
      .populate('studentId', 'firstName lastName studentId')
      .populate('merchantId', 'name type');

    const csvPath = `/tmp/sales_${Date.now()}.csv`;
    const writer = csvWriter.default.createObjectCsvWriter({
      path: csvPath,
      header: [
        { id: 'date', title: 'Date' },
        { id: 'time', title: 'Time' },
        { id: 'reference', title: 'Reference' },
        { id: 'merchantName', title: 'Merchant' },
        { id: 'merchantType', title: 'Merchant Type' },
        { id: 'amount', title: 'Amount (RWF)' },
        { id: 'studentName', title: 'Student Name' },
        { id: 'studentId', title: 'Student ID' }
      ]
    });

    const records = transactions.map((txn: any) => ({
      date: txn.date,
      time: new Date(txn.timestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }),
      reference: txn.reference,
      merchantName: txn.merchantId?.name || 'N/A',
      merchantType: txn.merchantId?.type || 'N/A',
      amount: txn.amount,
      studentName: txn.studentId 
        ? `${txn.studentId.firstName} ${txn.studentId.lastName}`
        : 'N/A',
      studentId: txn.studentId?.studentId || 'N/A'
    }));

    await writer.writeRecords(records);
    return csvPath;

  } catch (error: any) {
    throw new Error(`Failed to export sales: ${error.message}`);
  }
}

// Generate PDF report for attendance
export async function generateAttendancePDF(
  schoolId?: string,
  startDate?: string,
  endDate?: string
): Promise<Buffer> {
  try {
    const query: any = {};
    
    if (schoolId) query.schoolId = schoolId;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }

    const attendanceRecords = await Attendance.find(query)
      .sort({ timestamp: -1 })
      .populate('studentId', 'firstName lastName studentId grade class')
      .populate('schoolId', 'name');

    const doc = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));

    // Header
    doc.fontSize(20).text('Attendance Report', { align: 'center' });
    doc.moveDown();
    
    if (schoolId) {
      const school = await School.findById(schoolId);
      if (school) {
        doc.fontSize(12).text(`School: ${school.name}`, { align: 'center' });
      }
    }
    
    if (startDate || endDate) {
      doc.fontSize(10).text(
        `Period: ${startDate || 'Start'} to ${endDate || 'End'}`,
        { align: 'center' }
      );
    }
    
    doc.fontSize(10).text(
      `Generated: ${new Date().toLocaleString()}`,
      { align: 'center' }
    );
    doc.moveDown(2);

    // Table header
    doc.fontSize(10);
    doc.text('Date', 50, doc.y);
    doc.text('Time', 120, doc.y);
    doc.text('Student', 180, doc.y);
    doc.text('Location', 320, doc.y);
    doc.moveDown(0.5);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.3);

    // Table rows
    attendanceRecords.forEach((record: any, index: number) => {
      if (doc.y > 700) { // New page if needed
        doc.addPage();
        // Repeat header
        doc.fontSize(10);
        doc.text('Date', 50, doc.y);
        doc.text('Time', 120, doc.y);
        doc.text('Student', 180, doc.y);
        doc.text('Location', 320, doc.y);
        doc.moveDown(0.5);
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown(0.3);
      }

      const studentName = record.studentId 
        ? `${record.studentId.firstName} ${record.studentId.lastName}`
        : 'N/A';
      const time = new Date(record.timestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      doc.text(record.date, 50, doc.y);
      doc.text(time, 120, doc.y);
      doc.text(studentName, 180, doc.y, { width: 130 });
      doc.text(record.deviceLocation, 320, doc.y, { width: 200 });
      doc.moveDown(0.5);
    });

    // Summary
    doc.moveDown(2);
    doc.fontSize(12).text('Summary', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10);
    doc.text(`Total Records: ${attendanceRecords.length}`);
    doc.text(`Date Range: ${startDate || 'All'} to ${endDate || 'All'}`);

    doc.end();

    // Wait for PDF to be generated
    return new Promise((resolve, reject) => {
      doc.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
      doc.on('error', reject);
    });

  } catch (error: any) {
    throw new Error(`Failed to generate attendance PDF: ${error.message}`);
  }
}

// Generate PDF report for transactions
export async function generateTransactionsPDF(
  schoolId?: string,
  startDate?: string,
  endDate?: string,
  type?: string
): Promise<Buffer> {
  try {
    const query: any = {};
    
    if (type) query.type = type;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }

    if (schoolId) {
      const students = await Student.find({ schoolId });
      query.studentId = { $in: students.map(s => s._id) };
    }

    const transactions = await Transaction.find(query)
      .sort({ timestamp: -1 })
      .limit(100) // Limit for PDF
      .populate('studentId', 'firstName lastName studentId')
      .populate('merchantId', 'name type');

    // Calculate summary
    const summary = await Transaction.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    const doc = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));

    // Header
    doc.fontSize(20).text('Transaction Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });
    doc.moveDown(2);

    // Summary
    doc.fontSize(12).text('Summary', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10);
    summary.forEach((s: any) => {
      doc.text(`${s._id}: ${s.count} transactions, Total: ${s.total} RWF`);
    });
    doc.moveDown(2);

    // Table header
    doc.fontSize(10);
    doc.text('Date', 50, doc.y);
    doc.text('Type', 100, doc.y);
    doc.text('Amount', 150, doc.y);
    doc.text('Student', 220, doc.y);
    doc.text('Merchant', 320, doc.y);
    doc.moveDown(0.5);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.3);

    // Table rows
    transactions.forEach((txn: any) => {
      if (doc.y > 700) {
        doc.addPage();
        doc.fontSize(10);
        doc.text('Date', 50, doc.y);
        doc.text('Type', 100, doc.y);
        doc.text('Amount', 150, doc.y);
        doc.text('Student', 220, doc.y);
        doc.text('Merchant', 320, doc.y);
        doc.moveDown(0.5);
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown(0.3);
      }

      const studentName = txn.studentId 
        ? `${txn.studentId.firstName} ${txn.studentId.lastName}`
        : 'N/A';

      doc.text(txn.date, 50, doc.y);
      doc.text(txn.type, 100, doc.y);
      doc.text(`${txn.amount} RWF`, 150, doc.y);
      doc.text(studentName, 220, doc.y, { width: 90 });
      doc.text(txn.merchantId?.name || 'N/A', 320, doc.y, { width: 200 });
      doc.moveDown(0.5);
    });

    doc.end();

    return new Promise((resolve, reject) => {
      doc.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
      doc.on('error', reject);
    });

  } catch (error: any) {
    throw new Error(`Failed to generate transactions PDF: ${error.message}`);
  }
}

