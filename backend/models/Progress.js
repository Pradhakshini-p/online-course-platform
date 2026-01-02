// backend/models/Progress.js
import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema(
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
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
      required: [true, 'Please provide a lesson ID'],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
    timeSpent: {
      type: Number,
      default: 0, // minutes
      min: 0,
    },
    lastAccessedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure one progress record per student per lesson
progressSchema.index({ studentId: 1, lessonId: 1 }, { unique: true });
progressSchema.index({ studentId: 1, courseId: 1 });

const Progress = mongoose.model('Progress', progressSchema);

export default Progress;

