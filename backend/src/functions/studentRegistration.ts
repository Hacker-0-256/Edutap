import { Student } from '../models/student.js';
import { Parent } from '../models/parent.js';
import { School } from '../models/school.js';
import { Account } from '../models/account.js';
import { sendSMS } from './sms.js';

// Register student with parent/guardian information
export async function registerStudentWithParent(
  // Student information
  studentData: {
    firstName: string;
    lastName: string;
    studentId: string;
    cardUID: string;
    grade: string;
    class: string;
    schoolId: string;
    initialBalance?: number;
  },
  // Parent/Guardian information
  parentData: {
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
    address?: string;
    receiveSMS?: boolean;
  }
) {
  try {
    // 1. Validate school exists
    const school = await School.findById(studentData.schoolId);
    if (!school) {
      throw new Error('School not found');
    }

    // 2. Check if student already exists
    const existingStudent = await Student.findOne({
      $or: [
        { studentId: studentData.studentId },
        { cardUID: studentData.cardUID }
      ]
    });
    if (existingStudent) {
      throw new Error('Student with this ID or card UID already exists');
    }

    // 3. Find or create parent/guardian
    // First, try to find by phone number
    let parent = await Parent.findOne({ phone: parentData.phone });
    
    if (!parent) {
      // Create new parent
      parent = await Parent.create({
        firstName: parentData.firstName,
        lastName: parentData.lastName,
        phone: parentData.phone,
        email: parentData.email || '',
        address: parentData.address,
        schoolId: studentData.schoolId,
        receiveSMS: parentData.receiveSMS !== false // Default to true
      });
    } else {
      // Parent exists, but verify they're linked to the same school
      if (parent.schoolId.toString() !== studentData.schoolId) {
        // Update parent's school if needed (in case they have multiple children in different schools)
        // Or throw error - depends on business logic
        // For now, we'll allow it but log a warning
        console.warn(`Parent ${parent._id} is being linked to a different school`);
      }
      
      // Update parent information if provided
      if (parentData.email && parentData.email !== parent.email) {
        parent.email = parentData.email;
      }
      if (parentData.address && parentData.address !== parent.address) {
        parent.address = parentData.address;
      }
      if (parentData.receiveSMS !== undefined) {
        parent.receiveSMS = parentData.receiveSMS;
      }
      await parent.save();
    }

    // 4. Create student account
    const account = await Account.create({
      studentId: null, // Will be updated after student creation
      balance: studentData.initialBalance || 0,
      currency: 'RWF'
    });

    // 5. Create student
    const student = await Student.create({
      firstName: studentData.firstName,
      lastName: studentData.lastName,
      studentId: studentData.studentId,
      cardUID: studentData.cardUID,
      grade: studentData.grade,
      class: studentData.class,
      parentId: parent._id,
      schoolId: studentData.schoolId,
      accountId: account._id,
      cardStatus: 'active'
    });

    // 6. Update account with student reference
    account.studentId = student._id;
    await account.save();

    // 7. Send welcome SMS to parent
    let smsResult: { success: boolean; error?: string } = { success: false };
    if (parent.receiveSMS && parent.phone) {
      try {
        const message = `Hello ${parent.firstName}, your child ${student.firstName} ${student.lastName} (${student.studentId}) has been successfully registered at ${school.name}. You will receive SMS notifications for attendance and payments.`;
        
        const smsResponse = await sendSMS(parent.phone, message);
        smsResult = {
          success: smsResponse.success,
          error: smsResponse.success ? undefined : smsResponse.error
        };
      } catch (smsError: any) {
        console.error('Error sending welcome SMS:', smsError.message);
        smsResult = {
          success: false,
          error: smsError.message
        };
      }
    }

    return {
      success: true,
      student: {
        id: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
        studentId: student.studentId,
        cardUID: student.cardUID,
        grade: student.grade,
        class: student.class,
        accountBalance: account.balance
      },
      parent: {
        id: parent._id,
        firstName: parent.firstName,
        lastName: parent.lastName,
        phone: parent.phone,
        email: parent.email,
        receiveSMS: parent.receiveSMS
      },
      school: {
        id: school._id,
        name: school.name
      },
      smsNotification: {
        sent: smsResult.success,
        error: smsResult.error
      }
    };

  } catch (error: any) {
    throw new Error(`Student registration failed: ${error.message}`);
  }
}

// Register multiple students with the same parent (siblings)
export async function registerMultipleStudentsWithParent(
  studentsData: Array<{
    firstName: string;
    lastName: string;
    studentId: string;
    cardUID: string;
    grade: string;
    class: string;
    initialBalance?: number;
  }>,
  schoolId: string,
  parentData: {
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
    address?: string;
    receiveSMS?: boolean;
  }
) {
  try {
    const results = [];
    
    for (const studentData of studentsData) {
      const result = await registerStudentWithParent(
        { ...studentData, schoolId },
        parentData
      );
      results.push(result);
    }

    return {
      success: true,
      count: results.length,
      students: results.map(r => r.student),
      parent: results[0].parent, // Same parent for all
      school: results[0].school
    };

  } catch (error: any) {
    throw new Error(`Multiple student registration failed: ${error.message}`);
  }
}

