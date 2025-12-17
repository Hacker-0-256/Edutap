import { Student } from '../models/student.js';
import { Parent } from '../models/parent.js';
import { School } from '../models/school.js';
import { Attendance } from '../models/attendance.js';

// School controller for managing students and parents

// Create a new student
export async function createStudent(req: any, res: any) {
  try {
    const {
      firstName,
      lastName,
      studentId,
      cardUID,
      grade,
      class: className,
      parentId,
      schoolId
    } = req.body;

    // Simple validation
    if (!firstName || !lastName || !studentId || !cardUID || !grade || !className || !parentId || !schoolId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if parent exists
    const parent = await Parent.findById(parentId);
    if (!parent) {
      return res.status(404).json({
        success: false,
        message: 'Parent not found'
      });
    }

    // Create student
    const student = await Student.create({
      firstName,
      lastName,
      studentId,
      cardUID,
      grade,
      class: className,
      parentId,
      schoolId
    });

    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: student
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

// Get all students for the school
export async function getStudents(req: any, res: any) {
  try {
    const { schoolId } = req.params;
    const students = await Student.find({ schoolId, isActive: true })
      .populate('parentId', 'firstName lastName phone email')
      .populate('schoolId', 'name');

    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

// Get a single student
export async function getStudent(req: any, res: any) {
  try {
    const student = await Student.findById(req.params.id)
      .populate('parentId')
      .populate('schoolId');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

// Update a student
export async function updateStudent(req: any, res: any) {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: student
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

// Delete (deactivate) a student
export async function deleteStudent(req: any, res: any) {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student deactivated successfully'
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

// Create a new parent
export async function createParent(req: any, res: any) {
  try {
    const { firstName, lastName, phone, email, address, receiveSMS, schoolId } = req.body;

    // Simple validation
    if (!firstName || !lastName || !phone || !email || !schoolId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (firstName, lastName, phone, email, schoolId)'
      });
    }

    // Validate school exists
    const school = await School.findById(schoolId);
    if (!school) {
      return res.status(404).json({
        success: false,
        message: 'School not found'
      });
    }

    // Check if parent with this phone already exists
    const existingParent = await Parent.findOne({ phone });
    if (existingParent) {
      return res.status(400).json({
        success: false,
        message: 'Parent with this phone number already exists',
        data: existingParent
      });
    }

    // Create parent
    const parent = await Parent.create({
      firstName,
      lastName,
      phone,
      email,
      address,
      schoolId,
      receiveSMS: receiveSMS !== false // Default to true
    });

    res.status(201).json({
      success: true,
      message: 'Parent created successfully',
      data: parent
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

// Get all parents for the school
export async function getParents(req: any, res: any) {
  try {
    const { schoolId } = req.params;
    // Assuming parents are linked via students, or we need to add schoolId to Parent model
    // For now, get all parents
    const parents = await Parent.find({ isActive: true });

    res.status(200).json({
      success: true,
      count: parents.length,
      data: parents
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

// Get a single parent
export async function getParent(req: any, res: any) {
  try {
    const parent = await Parent.findById(req.params.id);

    if (!parent) {
      return res.status(404).json({
        success: false,
        message: 'Parent not found'
      });
    }

    res.status(200).json({
      success: true,
      data: parent
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

// Update a parent
export async function updateParent(req: any, res: any) {
  try {
    const parent = await Parent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!parent) {
      return res.status(404).json({
        success: false,
        message: 'Parent not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Parent updated successfully',
      data: parent
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

// Delete (deactivate) a parent
export async function deleteParent(req: any, res: any) {
  try {
    const parent = await Parent.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!parent) {
      return res.status(404).json({
        success: false,
        message: 'Parent not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Parent deactivated successfully'
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

// Get today's attendance for the school
export async function getTodayAttendance(req: any, res: any) {
  try {
    const { schoolId } = req.params;
    const today = new Date().toISOString().split('T')[0];

    const attendanceRecords = await Attendance.find({
      schoolId,
      date: today
    })
      .sort({ timestamp: -1 })
      .populate('studentId', 'firstName lastName studentId grade class');

    // Get all students for this school to show who attended vs who didn't
    const allStudents = await Student.find({ schoolId, isActive: true })
      .select('firstName lastName studentId grade class');

    // Create attendance summary
    const attendedStudentIds = attendanceRecords.map(record => record.studentId._id.toString());
    const attendedStudents = allStudents.filter(student => attendedStudentIds.includes(student._id.toString()));
    const absentStudents = allStudents.filter(student => !attendedStudentIds.includes(student._id.toString()));

    res.status(200).json({
      success: true,
      date: today,
      summary: {
        totalStudents: allStudents.length,
        attended: attendedStudents.length,
        absent: absentStudents.length,
        attendanceRate: allStudents.length > 0 ? Math.round((attendedStudents.length / allStudents.length) * 100) : 0
      },
      attendance: {
        present: attendanceRecords.map(record => ({
          student: record.studentId,
          arrivalTime: record.timestamp,
          deviceLocation: record.deviceLocation
        })),
        absent: absentStudents
      }
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

// Get attendance report for a specific date
export async function getAttendanceReport(req: any, res: any) {
  try {
    const { schoolId } = req.params;
    const { date } = req.query;
    const targetDate = date || new Date().toISOString().split('T')[0];

    const attendanceRecords = await Attendance.find({
      schoolId,
      date: targetDate
    })
      .sort({ timestamp: -1 })
      .populate('studentId', 'firstName lastName studentId grade class');

    // Get all students for comparison
    const allStudents = await Student.find({ schoolId, isActive: true })
      .select('firstName lastName studentId grade class');

    const attendedStudentIds = attendanceRecords.map(record => record.studentId._id.toString());
    const attendedStudents = allStudents.filter(student => attendedStudentIds.includes(student._id.toString()));
    const absentStudents = allStudents.filter(student => !attendedStudentIds.includes(student._id.toString()));

    res.status(200).json({
      success: true,
      date: targetDate,
      summary: {
        totalStudents: allStudents.length,
        attended: attendedStudents.length,
        absent: absentStudents.length,
        attendanceRate: allStudents.length > 0 ? Math.round((attendedStudents.length / allStudents.length) * 100) : 0
      },
      details: {
        present: attendanceRecords.map(record => ({
          student: record.studentId,
          arrivalTime: record.timestamp,
          deviceLocation: record.deviceLocation
        })),
        absent: absentStudents
      }
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

// Get attendance statistics for the school
export async function getAttendanceStats(req: any, res: any) {
  try {
    const { schoolId } = req.params;
    const { days = 30 } = req.query;

    const since = new Date(Date.now() - (parseInt(days as string) * 24 * 60 * 60 * 1000));

    // Get attendance records for the period
    const attendanceRecords = await Attendance.find({
      schoolId,
      timestamp: { $gte: since }
    }).populate('studentId', 'firstName lastName grade class');

    // Get total students
    const totalStudents = await Student.countDocuments({ schoolId, isActive: true });

    // Calculate daily attendance
    const dailyStats = {};
    attendanceRecords.forEach(record => {
      const date = record.date;
      if (!dailyStats[date]) {
        dailyStats[date] = { count: 0, students: new Set() };
      }
      dailyStats[date].students.add(record.studentId._id.toString());
    });

    // Convert to array and calculate rates
    const dailyAttendance = Object.keys(dailyStats).map(date => {
      const dayData = dailyStats[date];
      return {
        date,
        attended: dayData.students.size,
        total: totalStudents,
        rate: Math.round((dayData.students.size / totalStudents) * 100)
      };
    }).sort((a, b) => b.date.localeCompare(a.date));

    // Overall statistics
    const totalAttendanceDays = dailyAttendance.length;
    const avgAttendanceRate = totalAttendanceDays > 0
      ? Math.round(dailyAttendance.reduce((sum, day) => sum + day.rate, 0) / totalAttendanceDays)
      : 0;

    res.status(200).json({
      success: true,
      period: {
        days: parseInt(days as string),
        startDate: since.toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
      },
      summary: {
        totalStudents,
        totalAttendanceRecords: attendanceRecords.length,
        averageAttendanceRate: avgAttendanceRate,
        totalSchoolDays: totalAttendanceDays
      },
      dailyAttendance: dailyAttendance
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

// Get student-specific attendance history
export async function getStudentAttendanceHistory(req: any, res: any) {
  try {
    const { schoolId, studentId } = req.params;
    const { limit = 30 } = req.query;

    // Verify student belongs to this school
    const student = await Student.findOne({ _id: studentId, schoolId, isActive: true });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found in this school'
      });
    }

    const attendanceRecords = await Attendance.find({ studentId })
      .sort({ timestamp: -1 })
      .limit(parseInt(limit as string))
      .populate('schoolId', 'name');

    res.status(200).json({
      success: true,
      student: {
        id: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
        studentId: student.studentId,
        grade: student.grade,
        class: student.class
      },
      attendance: {
        count: attendanceRecords.length,
        records: attendanceRecords
      }
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}