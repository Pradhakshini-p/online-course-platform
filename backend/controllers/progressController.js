// backend/controllers/progressController.js
import Progress from '../models/Progress.js';
import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';
import { asyncHandler, calculateProgress } from '../utils/helpers.js';

// @desc    Mark lesson as completed
// @route   POST /api/progress/complete
// @access  Private (Enrolled Student)
export const markLessonComplete = asyncHandler(async (req, res) => {
  const { courseId, lessonId } = req.body;

  if (!courseId || !lessonId) {
    return res.status(400).json({
      success: false,
      error: 'Please provide courseId and lessonId',
    });
  }

  // Check if student is enrolled
  const enrollment = await Enrollment.findOne({
    studentId: req.user.id,
    courseId,
  });

  if (!enrollment) {
    return res.status(403).json({
      success: false,
      error: 'You must be enrolled in this course to mark lessons as complete',
    });
  }

  // Check if lesson exists and belongs to course
  const lesson = await Lesson.findOne({
    _id: lessonId,
    courseId,
  });

  if (!lesson) {
    return res.status(404).json({
      success: false,
      error: 'Lesson not found or does not belong to this course',
    });
  }

  // Create or update progress
  let progress = await Progress.findOne({
    studentId: req.user.id,
    lessonId,
  });

  if (progress) {
    // Update existing progress
    progress.completed = true;
    progress.completedAt = new Date();
    await progress.save();
  } else {
    // Create new progress
    progress = await Progress.create({
      studentId: req.user.id,
      courseId,
      lessonId,
      completed: true,
      completedAt: new Date(),
    });
  }

  // Calculate course progress
  const totalLessons = await Lesson.countDocuments({ courseId });
  const completedLessons = await Progress.countDocuments({
    studentId: req.user.id,
    courseId,
    completed: true,
  });

  const courseProgressPercentage = calculateProgress(completedLessons, totalLessons);

  // Update enrollment progress
  await Enrollment.findOneAndUpdate(
    {
      studentId: req.user.id,
      courseId,
    },
    {
      progress: courseProgressPercentage,
      ...(courseProgressPercentage === 100 && !enrollment.completedAt
        ? { completedAt: new Date() }
        : {}),
    }
  );

  res.status(200).json({
    success: true,
    message: 'Lesson marked as completed',
    data: {
      progress,
      courseProgress: courseProgressPercentage,
      completedLessons,
      totalLessons,
    },
  });
});

// @desc    Get progress for a specific course
// @route   GET /api/progress/course/:courseId
// @access  Private (Enrolled Student, Course Instructor, Admin)
export const getCourseProgress = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  // Check if course exists
  const course = await Course.findById(courseId);
  if (!course) {
    return res.status(404).json({
      success: false,
      error: 'Course not found',
    });
  }

  // Check if user is enrolled or is instructor/admin
  const enrollment = await Enrollment.findOne({
    studentId: req.user.id,
    courseId,
  });

  const isInstructor =
    course.instructor.toString() === req.user.id || req.user.role === 'admin';

  if (!enrollment && !isInstructor) {
    return res.status(403).json({
      success: false,
      error: 'You must be enrolled in this course to view progress',
    });
  }

  // Get all lessons for the course
  const lessons = await Lesson.find({ courseId }).sort({ lessonNumber: 1 });

  // Get progress for all lessons
  const progressRecords = await Progress.find({
    studentId: req.user.id,
    courseId,
  });

  // Map progress to lessons
  const lessonsWithProgress = lessons.map((lesson) => {
    const progress = progressRecords.find(
      (p) => p.lessonId.toString() === lesson._id.toString()
    );

    return {
      lessonId: lesson._id,
      lessonTitle: lesson.title,
      sectionTitle: lesson.sectionTitle,
      lessonNumber: lesson.lessonNumber,
      duration: lesson.duration,
      completed: progress ? progress.completed : false,
      completedAt: progress ? progress.completedAt : null,
      timeSpent: progress ? progress.timeSpent : 0,
      lastAccessedAt: progress ? progress.lastAccessedAt : null,
    };
  });

  // Calculate overall progress
  const totalLessons = lessons.length;
  const completedLessons = progressRecords.filter((p) => p.completed).length;
  const progressPercentage = calculateProgress(completedLessons, totalLessons);

  res.status(200).json({
    success: true,
    data: {
      courseId,
      courseTitle: course.title,
      totalLessons,
      completedLessons,
      progress: progressPercentage,
      lessons: lessonsWithProgress,
    },
  });
});

// @desc    Get overall progress overview for all enrolled courses
// @route   GET /api/progress/overview
// @access  Private (Student)
export const getProgressOverview = asyncHandler(async (req, res) => {
  // Get all enrollments
  const enrollments = await Enrollment.find({ studentId: req.user.id }).populate(
    'courseId',
    'title thumbnail instructor'
  );

  // Calculate progress for each course
  const coursesWithProgress = await Promise.all(
    enrollments.map(async (enrollment) => {
      const course = enrollment.courseId;
      const totalLessons = await Lesson.countDocuments({
        courseId: course._id,
      });
      const completedLessons = await Progress.countDocuments({
        studentId: req.user.id,
        courseId: course._id,
        completed: true,
      });
      const progress = calculateProgress(completedLessons, totalLessons);

      return {
        courseId: course._id,
        courseTitle: course.title,
        courseThumbnail: course.thumbnail,
        instructor: course.instructor,
        progress,
        completedLessons,
        totalLessons,
        isCompleted: progress === 100,
        enrolledAt: enrollment.enrolledAt,
        completedAt: enrollment.completedAt,
      };
    })
  );

  // Calculate overall stats
  const totalCourses = coursesWithProgress.length;
  const completedCourses = coursesWithProgress.filter((c) => c.isCompleted).length;
  const inProgressCourses = totalCourses - completedCourses;

  res.status(200).json({
    success: true,
    data: {
      totalCourses,
      completedCourses,
      inProgressCourses,
      courses: coursesWithProgress,
    },
  });
});

