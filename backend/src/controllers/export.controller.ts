import { Request, Response } from 'express';
import fs from 'fs';
import {
  exportAttendanceToCSV,
  exportTransactionsToCSV,
  exportSalesToCSV,
  generateAttendancePDF,
  generateTransactionsPDF
} from '../functions/export.js';

// Export attendance report
export async function exportAttendanceReport(req: Request, res: Response) {
  try {
    const { format = 'csv', startDate, endDate, schoolId } = req.query;

    if (format === 'csv') {
      const csvPath = await exportAttendanceToCSV(
        schoolId as string | undefined,
        startDate as string | undefined,
        endDate as string | undefined
      );

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=attendance_${Date.now()}.csv`);
      
      const fileStream = fs.createReadStream(csvPath);
      fileStream.pipe(res);

      fileStream.on('end', () => {
        fs.unlinkSync(csvPath); // Clean up temp file
      });

    } else if (format === 'pdf') {
      const pdfBuffer = await generateAttendancePDF(
        schoolId as string | undefined,
        startDate as string | undefined,
        endDate as string | undefined
      );

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=attendance_${Date.now()}.pdf`);
      res.send(pdfBuffer);

    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid format. Use "csv" or "pdf"'
      });
    }

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

// Export transaction report
export async function exportTransactionReport(req: Request, res: Response) {
  try {
    const { format = 'csv', startDate, endDate, schoolId, type } = req.query;

    if (format === 'csv') {
      const csvPath = await exportTransactionsToCSV(
        schoolId as string | undefined,
        startDate as string | undefined,
        endDate as string | undefined,
        type as string | undefined
      );

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=transactions_${Date.now()}.csv`);
      
      const fileStream = fs.createReadStream(csvPath);
      fileStream.pipe(res);

      fileStream.on('end', () => {
        fs.unlinkSync(csvPath);
      });

    } else if (format === 'pdf') {
      const pdfBuffer = await generateTransactionsPDF(
        schoolId as string | undefined,
        startDate as string | undefined,
        endDate as string | undefined,
        type as string | undefined
      );

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=transactions_${Date.now()}.pdf`);
      res.send(pdfBuffer);

    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid format. Use "csv" or "pdf"'
      });
    }

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

// Export sales report
export async function exportSalesReport(req: Request, res: Response) {
  try {
    const { format = 'csv', startDate, endDate, schoolId, merchantId } = req.query;

    if (format === 'csv') {
      const csvPath = await exportSalesToCSV(
        merchantId as string | undefined,
        schoolId as string | undefined,
        startDate as string | undefined,
        endDate as string | undefined
      );

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=sales_${Date.now()}.csv`);
      
      const fileStream = fs.createReadStream(csvPath);
      fileStream.pipe(res);

      fileStream.on('end', () => {
        fs.unlinkSync(csvPath);
      });

    } else {
      return res.status(400).json({
        success: false,
        message: 'Sales export currently only supports CSV format'
      });
    }

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

