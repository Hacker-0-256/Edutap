import { Student } from '../models/student.js';
import { Parent } from '../models/parent.js';
import { Attendance } from '../models/attendance.js';

// Parent controller for managing their own data and viewing children's attendance

// Get parent profile
export async function getProfile(req: any, res: any) {
  try {
    const { parentId } = req.user; // Assuming middleware sets req.user

    const parent = await Parent.findById(parentId);

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

// Update parent profile
export async function updateProfile(req: any, res: any) {
  try {
    const { parentId } = req.user;

    const parent = await Parent.findByIdAndUpdate(
      parentId,
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
      message: 'Profile updated successfully',
      data: parent
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

// Get children (students) of the parent
export async function getChildren(req: any, res: any) {
  try {
    const { parentId } = req.user;

    const students = await Student.find({ parentId, isActive: true })
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

// Get attendance for a specific child
export async function getChildAttendance(req: any, res: any) {
  try {
    const { parentId } = req.user;
    const { studentId } = req.params;
    const { date, limit = 30 } = req.query;

    // Verify the student belongs to the parent
    const student = await Student.findOne({ _id: studentId, parentId });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found or does not belong to you'
      });
    }

    let query: any = { studentId };

    if (date) {
      query.date = date;
    }

    const attendance = await Attendance.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit as string))
      .populate('schoolId', 'name');

    res.status(200).json({
      success: true,
      count: attendance.length,
      data: attendance
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

// Get attendance summary for all children
export async function getAttendanceSummary(req: any, res: any) {
  try {
    const { parentId } = req.user;
    const { days = 7 } = req.query;

    const students = await Student.find({ parentId, isActive: true });

    const summary = [];

    for (const student of students) {
      const since = new Date(Date.now() - (parseInt(days as string) * 24 * 60 * 60 * 1000));

      const attendance = await Attendance.find({
        studentId: student._id,
        timestamp: { $gte: since }
      }).sort({ timestamp: -1 });

      const arrivals = attendance.length; // All records are arrivals

      summary.push({
        student: {
          id: student._id,
          firstName: student.firstName,
          lastName: student.lastName,
          grade: student.grade,
          class: student.class
        },
        recentAttendance: {
          arrivals,
          totalRecords: attendance.length
        }
      });
    }

    res.status(200).json({
      success: true,
      data: summary
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}