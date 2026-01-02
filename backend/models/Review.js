// backend/models/Review.js
import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide a student ID'],
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Please provide a course ID'],
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5'],
    },
    comment: {
      type: String,
      maxlength: [1000, 'Comment cannot be more than 1000 characters'],
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Ensure one review per student per course
reviewSchema.index({ studentId: 1, courseId: 1 }, { unique: true });
reviewSchema.index({ courseId: 1, rating: 1 });

const Review = mongoose.model('Review', reviewSchema);

export default Review;

