// backend/models/Lesson.js
import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Please provide a course ID'],
    },
    sectionTitle: {
      type: String,
      required: [true, 'Please provide a section title'],
      trim: true,
    },
    lessonNumber: {
      type: Number,
      required: [true, 'Please provide a lesson number'],
      min: [1, 'Lesson number must be at least 1'],
    },
    title: {
      type: String,
      required: [true, 'Please provide a lesson title'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    contentType: {
      type: String,
      enum: ['video', 'text', 'quiz'],
      default: 'video',
    },
    videoUrl: {
      type: String,
      default: '',
    },
    textContent: {
      type: String,
      default: '',
    },
    duration: {
      type: Number,
      required: [true, 'Please provide lesson duration in minutes'],
      min: [0, 'Duration cannot be negative'],
    },
    isPreview: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for course and lesson number
lessonSchema.index({ courseId: 1, lessonNumber: 1 });
lessonSchema.index({ courseId: 1, sectionTitle: 1 });

const Lesson = mongoose.model('Lesson', lessonSchema);

export default Lesson;

