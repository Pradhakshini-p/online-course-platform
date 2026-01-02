// backend/models/Enrollment.js
import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema(
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
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure one enrollment per student per course
enrollmentSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

export default Enrollment;
