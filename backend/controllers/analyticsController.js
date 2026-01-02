// backend/controllers/analyticsController.js
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import Progress from '../models/Progress.js';
import Lesson from '../models/Lesson.js';
import Review from '../models/Review.js';
import { asyncHandler, calculateProgress } from '../utils/helpers.js';

// @desc    Get instructor analytics overview
// @route   GET /api/analytics/instructor/overview
// @access  Private (Instructor, Admin)
export const getInstructorOverview = asyncHandler(async (req, res) => {
  // Get all courses by instructor
  const courses = await Course.find({ instructor: req.user.id });

  // Calculate overall stats
  let totalStudents = 0;
  let totalRevenue = 0;
  let totalRatingSum = 0;
  let totalRatingCount = 0;

  // Get detailed stats for each course
  const courseStats = await Promise.all(
    courses.map(async (course) => {
      // Get enrollments for this course
      const enrollments = await Enrollment.find({ courseId: course._id });
      const enrolledCount = enrollments.length;
      totalStudents += enrolledCount;

      // Calculate revenue (price * enrolledCount)
      const revenue = course.price * enrolledCount;
      totalRevenue += revenue;

      // Get completion stats
      const totalLessons = await Lesson.countDocuments({
        courseId: course._id,
      });
      let completedCount = 0;
      let totalProgress = 0;

      for (const enrollment of enrollments) {
        const completedLessons = await Progress.countDocuments({
          studentId: enrollment.studentId,
          courseId: course._id,
          completed: true,
        });
        if (completedLessons === totalLessons && totalLessons > 0) {
          completedCount++;
        }
        const progress = calculateProgress(completedLessons, totalLessons);
        totalProgress += progress;
      }

      const completionRate =
        enrolledCount > 0 ? (completedCount / enrolledCount) * 100 : 0;
      const averageProgress =
        enrolledCount > 0 ? totalProgress / enrolledCount : 0;

      // Rating stats
      if (course.averageRating > 0) {
        totalRatingSum += course.averageRating * course.totalReviews;
        totalRatingCount += course.totalReviews;
      }

      return {
        courseId: course._id,
        courseTitle: course.title,
        enrolledCount,
        completionRate: Math.round(completionRate * 10) / 10,
        averageProgress: Math.round(averageProgress * 10) / 10,
        averageRating: course.averageRating,
        totalReviews: course.totalReviews,
        revenue: Math.round(revenue * 100) / 100,
      };
    })
  );

  // Calculate average rating
  const averageRating =
    totalRatingCount > 0
      ? Math.round((totalRatingSum / totalRatingCount) * 10) / 10
      : 0;

  res.status(200).json({
    success: true,
    data: {
      totalCourses: courses.length,
      totalStudents,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      averageRating,
      courses: courseStats,
    },
  });
});

// @desc    Get detailed analytics for a specific course
// @route   GET /api/analytics/instructor/course/:courseId
// @access  Private (Course Instructor, Admin)
export const getCourseAnalytics = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  // Get course
  const course = await Course.findById(courseId).populate(
    'instructor',
    'name email'
  );

  if (!course) {
    return res.status(404).json({
      success: false,
      error: 'Course not found',
    });
  }

  // Check if user is instructor or admin
  if (
    course.instructor._id.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to view analytics for this course',
    });
  }

  // Get enrollments
  const enrollments = await Enrollment.find({ courseId });
  const enrolledCount = enrollments.length;

  // Get completion stats
  const totalLessons = await Lesson.countDocuments({ courseId });
  let completedCount = 0;
  let totalProgressSum = 0;

  for (const enrollment of enrollments) {
    const completedLessons = await Progress.countDocuments({
      studentId: enrollment.studentId,
      courseId,
      completed: true,
    });
    if (completedLessons === totalLessons && totalLessons > 0) {
      completedCount++;
    }
    const progress = calculateProgress(completedLessons, totalLessons);
    totalProgressSum += progress;
  }

  const completionRate =
    enrolledCount > 0 ? (completedCount / enrolledCount) * 100 : 0;
  const averageProgress =
    enrolledCount > 0 ? totalProgressSum / enrolledCount : 0;

  // Get lesson-level analytics
  const lessons = await Lesson.find({ courseId }).sort({ lessonNumber: 1 });
  const lessonStats = await Promise.all(
    lessons.map(async (lesson) => {
      const completedCount = await Progress.countDocuments({
        courseId,
        lessonId: lesson._id,
        completed: true,
      });
      const completionRate =
        enrolledCount > 0 ? (completedCount / enrolledCount) * 100 : 0;

      return {
        lessonId: lesson._id,
        lessonTitle: lesson.title,
        sectionTitle: lesson.sectionTitle,
        lessonNumber: lesson.lessonNumber,
        completedCount,
        completionRate: Math.round(completionRate * 10) / 10,
      };
    })
  );

  // Get review stats
  const reviews = await Review.find({ courseId });
  const ratingDistribution = {
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
  };

  res.status(200).json({
    success: true,
    data: {
      course: {
        _id: course._id,
        title: course.title,
        instructor: course.instructor,
      },
      enrolledCount,
      completedCount,
      completionRate: Math.round(completionRate * 10) / 10,
      averageProgress: Math.round(averageProgress * 10) / 10,
      lessons: lessonStats,
      reviews: {
        averageRating: course.averageRating,
        totalReviews: course.totalReviews,
        ratingDistribution,
      },
      revenue: Math.round(course.price * enrolledCount * 100) / 100,
    },
  });
});

