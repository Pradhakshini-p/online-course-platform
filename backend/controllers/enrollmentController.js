// backend/controllers/enrollmentController.js
import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import Progress from '../models/Progress.js';
import Lesson from '../models/Lesson.js';
import { asyncHandler } from '../utils/helpers.js';

// @desc    Enroll in a course
// @route   POST /api/enrollments
// @access  Private (Student, Admin)
export const enrollInCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.body;

  if (!courseId) {
    return res.status(400).json({
      success: false,
      error: 'Please provide a course ID',
    });
  }

  // Check if course exists
  const course = await Course.findById(courseId);
  if (!course) {
    return res.status(404).json({
      success: false,
      error: 'Course not found',
    });
  }

  // Check if already enrolled
  const existingEnrollment = await Enrollment.findOne({
    studentId: req.user.id,
    courseId,
  });

  if (existingEnrollment) {
    return res.status(400).json({
      success: false,
      error: 'Already enrolled in this course',
    });
  }

  // Check if course is free or paid (for now, allow all enrollments)
  // In future, you can add payment logic here

  // Create enrollment
  const enrollment = await Enrollment.create({
    studentId: req.user.id,
    courseId,
    progress: 0,
  });

  // Update course enrolled count
  await Course.findByIdAndUpdate(courseId, {
    $inc: { enrolledCount: 1 },
  });

  res.status(201).json({
    success: true,
    message: 'Enrolled successfully',
    data: {
      enrollment,
    },
  });
});

// @desc    Get all courses enrolled by current student
// @route   GET /api/enrollments/my-courses
// @access  Private (Student, Admin)
export const getMyEnrollments = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find({ studentId: req.user.id })
    .populate({
      path: 'courseId',
      populate: {
        path: 'instructor',
        select: 'name avatar',
      },
    })
    .sort({ enrolledAt: -1 });

  // Calculate progress for each enrollment
  const enrollmentsWithProgress = await Promise.all(
    enrollments.map(async (enrollment) => {
      const course = enrollment.courseId;

      // Get total lessons
      const totalLessons = await Lesson.countDocuments({
        courseId: course._id,
      });

      // Get completed lessons
      const completedLessons = await Progress.countDocuments({
        studentId: req.user.id,
        courseId: course._id,
        completed: true,
      });

      // Calculate progress percentage
      const progress =
        totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

      // Update enrollment progress
      if (enrollment.progress !== progress) {
        await Enrollment.findByIdAndUpdate(enrollment._id, { progress });
      }

      return {
        ...enrollment.toObject(),
        courseProgress: progress,
        completedLessons,
        totalLessons,
      };
    })
  );

  res.status(200).json({
    success: true,
    data: {
      enrollments: enrollmentsWithProgress,
    },
  });
});

// @desc    Check enrollment status for a course
// @route   GET /api/enrollments/:courseId/status
// @access  Private
export const getEnrollmentStatus = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const enrollment = await Enrollment.findOne({
    studentId: req.user.id,
    courseId,
  });

  res.status(200).json({
    success: true,
    data: {
      isEnrolled: !!enrollment,
      enrollment: enrollment || null,
    },
  });
});

