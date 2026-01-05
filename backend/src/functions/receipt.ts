import PDFDocument from 'pdfkit';
import { Transaction } from '../models/transaction.js';
import { Student } from '../models/student.js';
import { Merchant } from '../models/merchant.js';
import { School } from '../models/school.js';

// Generate payment receipt as PDF
export async function generatePaymentReceipt(transactionId: string): Promise<Buffer> {
  try {
    const transaction = await Transaction.findById(transactionId)
      .populate('studentId', 'firstName lastName studentId grade class')
      .populate('merchantId', 'name type location contact')
      .populate('accountId');

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    if (transaction.type !== 'purchase') {
      throw new Error('Receipt can only be generated for purchase transactions');
    }

    const student = transaction.studentId as any;
    const merchant = transaction.merchantId as any;
    const account = transaction.accountId as any;

    // Get school info
    const school = await School.findById(student.schoolId);

    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));

    // Header
    doc.fontSize(20).text('PAYMENT RECEIPT', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(12).text(school?.name || 'School', { align: 'center' });
    doc.moveDown(2);

    // Receipt Details
    doc.fontSize(10);
    doc.text(`Receipt Number: ${transaction.reference}`, { continued: true, align: 'right' });
    doc.moveDown(0.5);
    doc.text(`Date: ${new Date(transaction.timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}`, { continued: true, align: 'right' });
    doc.text(`Time: ${new Date(transaction.timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })}`, { continued: true, align: 'right' });
    doc.moveDown(1);

    // Line
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(1);

    // Student Information
    doc.fontSize(12).text('Student Information', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10);
    doc.text(`Name: ${student.firstName} ${student.lastName}`);
    doc.text(`Student ID: ${student.studentId}`);
    doc.text(`Grade: ${student.grade} | Class: ${student.class}`);
    doc.moveDown(1);

    // Merchant Information
    doc.fontSize(12).text('Merchant Information', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10);
    doc.text(`Name: ${merchant.name}`);
    doc.text(`Type: ${merchant.type}`);
    if (merchant.location?.room) {
      doc.text(`Location: ${merchant.location.room}`);
    }
    doc.moveDown(1);

    // Transaction Details
    doc.fontSize(12).text('Transaction Details', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10);
    doc.text(`Description: ${transaction.description || 'Purchase'}`);
    doc.text(`Amount: ${transaction.amount} ${account?.currency || 'RWF'}`);
    doc.text(`Balance Before: ${transaction.balanceBefore} ${account?.currency || 'RWF'}`);
    doc.text(`Balance After: ${transaction.balanceAfter} ${account?.currency || 'RWF'}`);
    doc.text(`Status: ${transaction.status.toUpperCase()}`);
    doc.moveDown(1);

    // Line
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(1);

    // Footer
    doc.fontSize(9).text('Thank you for your purchase!', { align: 'center' });
    doc.moveDown(0.5);
    doc.text('This is an automated receipt. Please keep it for your records.', { align: 'center' });
    doc.moveDown(1);
    doc.fontSize(8).text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });

    doc.end();

    return new Promise((resolve, reject) => {
      doc.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
      doc.on('error', reject);
    });

  } catch (error: any) {
    throw new Error(`Failed to generate receipt: ${error.message}`);
  }
}

// Generate payment confirmation response
export function generatePaymentConfirmation(transaction: any, student: any, merchant: any) {
  return {
    success: true,
    confirmation: {
      transactionId: transaction._id,
      reference: transaction.reference,
      timestamp: transaction.timestamp,
      date: transaction.date,
      amount: transaction.amount,
      currency: 'RWF',
      status: transaction.status,
      student: {
        name: `${student.firstName} ${student.lastName}`,
        studentId: student.studentId
      },
      merchant: {
        name: merchant.name,
        type: merchant.type
      },
      balanceAfter: transaction.balanceAfter,
      description: transaction.description
    },
    message: 'Payment processed successfully'
  };
}

