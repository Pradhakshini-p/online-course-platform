// backend/models/Course.js
import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a course title'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a course description'],
      trim: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide an instructor'],
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      trim: true,
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      required: [true, 'Please provide a level'],
    },
    price: {
      type: Number,
      default: 0,
      min: [0, 'Price cannot be negative'],
    },
    thumbnail: {
      type: String,
      default: '',
    },
    duration: {
      type: Number,
      default: 0, // Total minutes, calculated from lessons
    },
    totalLessons: {
      type: Number,
      default: 0,
    },
    enrolledCount: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search and filtering
courseSchema.index({ title: 'text', description: 'text' });
courseSchema.index({ category: 1, level: 1, price: 1 });
courseSchema.index({ instructor: 1 });

// Virtual for course URL (if needed)
courseSchema.virtual('url').get(function () {
  return `/courses/${this._id}`;
});

const Course = mongoose.model('Course', courseSchema);

export default Course;
