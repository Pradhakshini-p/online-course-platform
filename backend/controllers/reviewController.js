// backend/controllers/reviewController.js
import Review from '../models/Review.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import { asyncHandler } from '../utils/helpers.js';

// Helper function to update course rating
const updateCourseRating = async (courseId) => {
  const reviews = await Review.find({ courseId });
  const totalReviews = reviews.length;
  
  if (totalReviews === 0) {
    await Course.findByIdAndUpdate(courseId, {
      averageRating: 0,
      totalReviews: 0,
    });
    return;
  }

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / totalReviews;

  await Course.findByIdAndUpdate(courseId, {
    averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
    totalReviews,
  });
};

// @desc    Add review for a course
// @route   POST /api/reviews
// @access  Private (Enrolled Student who completed course)
export const addReview = asyncHandler(async (req, res) => {
  const { courseId, rating, comment } = req.body;

  if (!courseId || !rating) {
    return res.status(400).json({
      success: false,
      error: 'Please provide courseId and rating',
    });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({
      success: false,
      error: 'Rating must be between 1 and 5',
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

  // Check if student is enrolled
  const enrollment = await Enrollment.findOne({
    studentId: req.user.id,
    courseId,
  });

  if (!enrollment) {
    return res.status(403).json({
      success: false,
      error: 'You must be enrolled in this course to add a review',
    });
  }

  // Optional: Check if course is completed (you can enable this if needed)
  // if (enrollment.progress < 100) {
  //   return res.status(403).json({
  //     success: false,
  //     error: 'You must complete the course before adding a review',
  //   });
  // }

  // Check if review already exists
  const existingReview = await Review.findOne({
    studentId: req.user.id,
    courseId,
  });

  if (existingReview) {
    return res.status(400).json({
      success: false,
      error: 'You have already reviewed this course',
    });
  }

  // Create review
  const review = await Review.create({
    studentId: req.user.id,
    courseId,
    rating,
    comment: comment || '',
  });

  // Update course rating
  await updateCourseRating(courseId);

  res.status(201).json({
    success: true,
    message: 'Review added successfully',
    data: {
      review,
    },
  });
});

// @desc    Get all reviews for a course
// @route   GET /api/reviews/course/:courseId
// @access  Public
export const getCourseReviews = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  // Check if course exists
  const course = await Course.findById(courseId);
  if (!course) {
    return res.status(404).json({
      success: false,
      error: 'Course not found',
    });
  }

  // Pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  // Get reviews
  const reviews = await Review.find({ courseId })
    .populate('studentId', 'name avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await Review.countDocuments({ courseId });

  // Calculate rating distribution
  const allReviews = await Review.find({ courseId });
  const ratingDistribution = {
    5: allReviews.filter((r) => r.rating === 5).length,
    4: allReviews.filter((r) => r.rating === 4).length,
    3: allReviews.filter((r) => r.rating === 3).length,
    2: allReviews.filter((r) => r.rating === 2).length,
    1: allReviews.filter((r) => r.rating === 1).length,
  };

  res.status(200).json({
    success: true,
    data: {
      reviews,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        limit: limitNum,
      },
      ratingDistribution,
      averageRating: course.averageRating,
      totalReviews: course.totalReviews,
    },
  });
});

// @desc    Update own review
// @route   PUT /api/reviews/:id
// @access  Private (Review Owner)
export const updateReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  let review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json({
      success: false,
      error: 'Review not found',
    });
  }

  // Check if user owns the review
  if (review.studentId.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to update this review',
    });
  }

  // Update review
  if (rating !== undefined) {
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: 'Rating must be between 1 and 5',
      });
    }
    review.rating = rating;
  }

  if (comment !== undefined) {
    review.comment = comment;
  }

  await review.save();

  // Update course rating
  await updateCourseRating(review.courseId);

  res.status(200).json({
    success: true,
    message: 'Review updated successfully',
    data: {
      review,
    },
  });
});

// @desc    Delete own review
// @route   DELETE /api/reviews/:id
// @access  Private (Review Owner, Admin)
export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json({
      success: false,
      error: 'Review not found',
    });
  }

  // Check if user owns the review or is admin
  if (
    review.studentId.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to delete this review',
    });
  }

  const courseId = review.courseId;

  // Delete review
  await review.deleteOne();

  // Update course rating
  await updateCourseRating(courseId);

  res.status(200).json({
    success: true,
    message: 'Review deleted successfully',
  });
});

