import { Student } from '../models/student.js';
import { Account } from '../models/account.js';

// Deactivate a card (for lost/stolen cards)
export async function deactivateCard(
  cardUID: string,
  reason: string,
  deactivatedBy?: string
) {
  try {
    // 1. Find student by card UID
    const student = await Student.findOne({ cardUID });
    if (!student) {
      throw new Error('Student not found with this card UID');
    }
    
    // 2. Check if already deactivated
    if (student.cardStatus !== 'active') {
      throw new Error(`Card is already ${student.cardStatus}`);
    }
    
    // 3. Update card status
    student.cardStatus = reason === 'lost' ? 'lost' : 
                         reason === 'stolen' ? 'stolen' : 
                         'deactivated';
    student.cardDeactivatedAt = new Date();
    student.cardDeactivatedReason = reason;
    
    await student.save();
    
    return {
      success: true,
      card: {
        cardUID: student.cardUID,
        status: student.cardStatus,
        deactivatedAt: student.cardDeactivatedAt,
        reason: student.cardDeactivatedReason
      },
      student: {
        name: `${student.firstName} ${student.lastName}`,
        studentId: student.studentId
      }
    };
  } catch (error: any) {
    console.error('Error deactivating card:', error.message);
    throw error;
  }
}

// Reactivate a card
export async function reactivateCard(cardUID: string) {
  try {
    // 1. Find student by card UID
    const student = await Student.findOne({ cardUID });
    if (!student) {
      throw new Error('Student not found with this card UID');
    }
    
    // 2. Check if card is already active
    if (student.cardStatus === 'active') {
      throw new Error('Card is already active');
    }
    
    // 3. Reactivate card
    student.cardStatus = 'active';
    student.cardDeactivatedAt = undefined;
    student.cardDeactivatedReason = undefined;
    
    await student.save();
    
    return {
      success: true,
      card: {
        cardUID: student.cardUID,
        status: student.cardStatus
      },
      student: {
        name: `${student.firstName} ${student.lastName}`,
        studentId: student.studentId
      }
    };
  } catch (error: any) {
    console.error('Error reactivating card:', error.message);
    throw error;
  }
}

// Replace a card (assign new card UID)
export async function replaceCard(
  oldCardUID: string,
  newCardUID: string
) {
  try {
    // 1. Find student by old card UID
    const student = await Student.findOne({ cardUID: oldCardUID });
    if (!student) {
      throw new Error('Student not found with old card UID');
    }
    
    // 2. Check if new card UID is already in use
    const existingStudent = await Student.findOne({ cardUID: newCardUID });
    if (existingStudent && existingStudent._id.toString() !== student._id.toString()) {
      throw new Error('New card UID is already assigned to another student');
    }
    
    // 3. Store old card UID and assign new one
    student.previousCardUID = oldCardUID;
    student.cardUID = newCardUID;
    student.cardStatus = 'active';
    student.cardDeactivatedAt = undefined;
    student.cardDeactivatedReason = undefined;
    
    await student.save();
    
    return {
      success: true,
      card: {
        oldCardUID: student.previousCardUID,
        newCardUID: student.cardUID,
        status: student.cardStatus
      },
      student: {
        name: `${student.firstName} ${student.lastName}`,
        studentId: student.studentId
      }
    };
  } catch (error: any) {
    console.error('Error replacing card:', error.message);
    throw error;
  }
}

// Get card status
export async function getCardStatus(cardUID: string) {
  try {
    const student = await Student.findOne({ cardUID })
      .populate('schoolId', 'name')
      .populate('parentId', 'firstName lastName');
    
    if (!student) {
      throw new Error('Card not found');
    }
    
    return {
      success: true,
      card: {
        cardUID: student.cardUID,
        status: student.cardStatus,
        deactivatedAt: student.cardDeactivatedAt,
        deactivatedReason: student.cardDeactivatedReason,
        previousCardUID: student.previousCardUID
      },
      student: {
        id: student._id,
        name: `${student.firstName} ${student.lastName}`,
        studentId: student.studentId,
        grade: student.grade,
        class: student.class
      },
      school: student.schoolId ? {
        name: (student.schoolId as any).name
      } : null
    };
  } catch (error: any) {
    console.error('Error fetching card status:', error.message);
    throw error;
  }
}

// Validate card can be used (for payments/attendance)
export async function validateCardStatus(cardUID: string): Promise<boolean> {
  try {
    const student = await Student.findOne({ cardUID, isActive: true });
    
    if (!student) {
      return false;
    }
    
    // Card must be active
    if (student.cardStatus !== 'active') {
      return false;
    }
    
    return true;
  } catch (error: any) {
    console.error('Error validating card status:', error.message);
    return false;
  }
}


