import { Request, Response } from 'express';
import { registerStudentWithParent, registerMultipleStudentsWithParent } from '../functions/studentRegistration.js';
import { validate } from '../middleware/validation.middleware.js';
import { registerStudentWithParentSchema } from '../validation/schemas.js';

// Register a student with parent/guardian information
export async function registerStudentWithParentController(req: Request, res: Response) {
  try {
    const {
      // Student data
      firstName,
      lastName,
      studentId,
      cardUID,
      grade,
      class: className,
      schoolId,
      initialBalance,
      // Parent data
      parentFirstName,
      parentLastName,
      parentPhone,
      parentEmail,
      parentAddress,
      parentReceiveSMS
    } = req.body;

    const result = await registerStudentWithParent(
      {
        firstName,
        lastName,
        studentId,
        cardUID,
        grade,
        class: className,
        schoolId,
        initialBalance
      },
      {
        firstName: parentFirstName,
        lastName: parentLastName,
        phone: parentPhone,
        email: parentEmail,
        address: parentAddress,
        receiveSMS: parentReceiveSMS
      }
    );

    res.status(201).json({
      success: true,
      message: 'Student and parent registered successfully',
      data: result
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

// Register multiple students (siblings) with the same parent
export async function registerMultipleStudentsController(req: Request, res: Response) {
  try {
    const {
      students,
      schoolId,
      parentFirstName,
      parentLastName,
      parentPhone,
      parentEmail,
      parentAddress,
      parentReceiveSMS
    } = req.body;

    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one student'
      });
    }

    const result = await registerMultipleStudentsWithParent(
      students,
      schoolId,
      {
        firstName: parentFirstName,
        lastName: parentLastName,
        phone: parentPhone,
        email: parentEmail,
        address: parentAddress,
        receiveSMS: parentReceiveSMS
      }
    );

    res.status(201).json({
      success: true,
      message: `${result.count} student(s) registered successfully with parent`,
      data: result
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

