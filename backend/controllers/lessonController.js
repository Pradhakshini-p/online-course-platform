// backend/controllers/lessonController.js
import Lesson from '../models/Lesson.js';
import Course from '../models/Course.js';
import { asyncHandler } from '../utils/helpers.js';

// @desc    Get all lessons for a course
// @route   GET /api/courses/:courseId/lessons
// @access  Public (limited info), Full if enrolled/instructor
export const getLessons = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  // Check if course exists
  const course = await Course.findById(courseId);
  if (!course) {
    return res.status(404).json({
      success: false,
      error: 'Course not found',
    });
  }

  // Get lessons
  const lessons = await Lesson.find({ courseId })
    .sort({ lessonNumber: 1 })
    .select('-videoUrl -textContent'); // Default: exclude content

  res.status(200).json({
    success: true,
    data: {
      lessons,
    },
  });
});

// @desc    Get single lesson by ID
// @route   GET /api/lessons/:id
// @access  Private (Enrolled students, Course Instructor, Admin)
export const getLesson = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findById(req.params.id).populate(
    'courseId',
    'title instructor'
  );

  if (!lesson) {
    return res.status(404).json({
      success: false,
      error: 'Lesson not found',
    });
  }

  // Check access (will be handled by middleware, but double-check here)
  const course = await Course.findById(lesson.courseId._id);
  if (!course) {
    return res.status(404).json({
      success: false,
      error: 'Course not found',
    });
  }

  res.status(200).json({
    success: true,
    data: {
      lesson,
    },
  });
});

// @desc    Add lesson to course
// @route   POST /api/courses/:courseId/lessons
// @access  Private (Course Instructor, Admin)
export const createLesson = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const {
    sectionTitle,
    lessonNumber,
    title,
    description,
    contentType,
    videoUrl,
    textContent,
    duration,
    isPreview,
  } = req.body;

  // Check if course exists
  const course = await Course.findById(courseId);
  if (!course) {
    return res.status(404).json({
      success: false,
      error: 'Course not found',
    });
  }

  // Check if user is instructor or admin
  if (
    course.instructor.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to add lessons to this course',
    });
  }

  // Validation
  if (!sectionTitle || !lessonNumber || !title || !duration) {
    return res.status(400).json({
      success: false,
      error: 'Please provide sectionTitle, lessonNumber, title, and duration',
    });
  }

  // Validate content based on contentType
  if (contentType === 'video' && !videoUrl) {
    return res.status(400).json({
      success: false,
      error: 'Please provide videoUrl for video content',
    });
  }

  if (contentType === 'text' && !textContent) {
    return res.status(400).json({
      success: false,
      error: 'Please provide textContent for text content',
    });
  }

  // Create lesson
  const lesson = await Lesson.create({
    courseId,
    sectionTitle,
    lessonNumber,
    title,
    description: description || '',
    contentType: contentType || 'video',
    videoUrl: videoUrl || '',
    textContent: textContent || '',
    duration,
    isPreview: isPreview || false,
  });

  // Update course duration and total lessons
  const allLessons = await Lesson.find({ courseId });
  const totalDuration = allLessons.reduce((sum, l) => sum + l.duration, 0);
  await Course.findByIdAndUpdate(courseId, {
    duration: totalDuration,
    totalLessons: allLessons.length,
  });

  res.status(201).json({
    success: true,
    message: 'Lesson created successfully',
    data: {
      lesson,
    },
  });
});

// @desc    Update lesson
// @route   PUT /api/lessons/:id
// @access  Private (Course Instructor, Admin)
export const updateLesson = asyncHandler(async (req, res) => {
  let lesson = await Lesson.findById(req.params.id);

  if (!lesson) {
    return res.status(404).json({
      success: false,
      error: 'Lesson not found',
    });
  }

  // Get course to check authorization
  const course = await Course.findById(lesson.courseId);
  if (!course) {
    return res.status(404).json({
      success: false,
      error: 'Course not found',
    });
  }

  // Check if user is instructor or admin
  if (
    course.instructor.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to update this lesson',
    });
  }

  // Update lesson
  lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  // Update course duration if duration changed
  if (req.body.duration) {
    const allLessons = await Lesson.find({ courseId: lesson.courseId });
    const totalDuration = allLessons.reduce((sum, l) => sum + l.duration, 0);
    await Course.findByIdAndUpdate(lesson.courseId, {
      duration: totalDuration,
      totalLessons: allLessons.length,
    });
  }

  res.status(200).json({
    success: true,
    message: 'Lesson updated successfully',
    data: {
      lesson,
    },
  });
});

// @desc    Delete lesson
// @route   DELETE /api/lessons/:id
// @access  Private (Course Instructor, Admin)
export const deleteLesson = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findById(req.params.id);

  if (!lesson) {
    return res.status(404).json({
      success: false,
      error: 'Lesson not found',
    });
  }

  // Get course to check authorization
  const course = await Course.findById(lesson.courseId);
  if (!course) {
    return res.status(404).json({
      success: false,
      error: 'Course not found',
    });
  }

  // Check if user is instructor or admin
  if (
    course.instructor.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to delete this lesson',
    });
  }

  // Delete lesson
  await lesson.deleteOne();

  // Update course duration and total lessons
  const allLessons = await Lesson.find({ courseId: lesson.courseId });
  const totalDuration = allLessons.reduce((sum, l) => sum + l.duration, 0);
  await Course.findByIdAndUpdate(lesson.courseId, {
    duration: totalDuration,
    totalLessons: allLessons.length,
  });

  res.status(200).json({
    success: true,
    message: 'Lesson deleted successfully',
  });
});

