// backend/controllers/courseController.js
import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';
import Enrollment from '../models/Enrollment.js';
import { asyncHandler } from '../utils/helpers.js';

// @desc    Get all published courses with filters
// @route   GET /api/courses
// @access  Public
export const getCourses = asyncHandler(async (req, res) => {
  const {
    category,
    level,
    minPrice,
    maxPrice,
    search,
    sort = 'newest',
    page = 1,
    limit = 10,
  } = req.query;

  // Build query
  const query = { isPublished: true };

  if (category) {
    query.category = category;
  }

  if (level) {
    query.level = level;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    query.price = {};
    if (minPrice !== undefined) query.price.$gte = Number(minPrice);
    if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
  }

  if (search) {
    query.$text = { $search: search };
  }

  // Build sort
  let sortOption = {};
  switch (sort) {
    case 'newest':
      sortOption = { createdAt: -1 };
      break;
    case 'oldest':
      sortOption = { createdAt: 1 };
      break;
    case 'popular':
      sortOption = { enrolledCount: -1 };
      break;
    case 'rating':
      sortOption = { averageRating: -1 };
      break;
    case 'price-low':
      sortOption = { price: 1 };
      break;
    case 'price-high':
      sortOption = { price: -1 };
      break;
    default:
      sortOption = { createdAt: -1 };
  }

  // Pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  // Execute query
  const courses = await Course.find(query)
    .populate('instructor', 'name avatar')
    .sort(sortOption)
    .skip(skip)
    .limit(limitNum);

  const total = await Course.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      courses,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        limit: limitNum,
      },
    },
  });
});

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Public (full details if enrolled/instructor)
export const getCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id).populate(
    'instructor',
    'name email avatar bio skills'
  );

  if (!course) {
    return res.status(404).json({
      success: false,
      error: 'Course not found',
    });
  }

  // Check if user is enrolled or is the instructor
  let isEnrolled = false;
  let canViewFullContent = false;

  if (req.user) {
    // Check enrollment
    const enrollment = await Enrollment.findOne({
      studentId: req.user.id,
      courseId: req.params.id,
    });
    isEnrolled = !!enrollment;

    // Check if user is instructor or admin
    canViewFullContent =
      isEnrolled ||
      course.instructor._id.toString() === req.user.id ||
      req.user.role === 'admin';
  }

  // Get lessons if user can view full content
  let lessons = [];
  if (canViewFullContent || course.isPublished) {
    lessons = await Lesson.find({ courseId: req.params.id })
      .sort({ lessonNumber: 1 })
      .select('-videoUrl -textContent'); // Exclude content for non-enrolled users

    // Include full content only if enrolled/instructor
    if (canViewFullContent) {
      lessons = await Lesson.find({ courseId: req.params.id }).sort({
        lessonNumber: 1,
      });
    }
  }

  res.status(200).json({
    success: true,
    data: {
      course: {
        ...course.toObject(),
        lessons: canViewFullContent ? lessons : lessons.map((l) => ({
          ...l.toObject(),
          videoUrl: l.isPreview ? l.videoUrl : undefined,
          textContent: l.isPreview ? l.textContent : undefined,
        })),
      },
      isEnrolled,
      canViewFullContent,
    },
  });
});

// @desc    Create new course
// @route   POST /api/courses
// @access  Private (Instructor, Admin)
export const createCourse = asyncHandler(async (req, res) => {
  const { title, description, category, level, price, thumbnail } = req.body;

  // Validation
  if (!title || !description || !category || !level) {
    return res.status(400).json({
      success: false,
      error: 'Please provide title, description, category, and level',
    });
  }

  // Create course
  const course = await Course.create({
    title,
    description,
    instructor: req.user.id,
    category,
    level,
    price: price || 0,
    thumbnail: thumbnail || '',
  });

  res.status(201).json({
    success: true,
    message: 'Course created successfully',
    data: {
      course,
    },
  });
});

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Course Instructor, Admin)
export const updateCourse = asyncHandler(async (req, res) => {
  let course = await Course.findById(req.params.id);

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
      error: 'Not authorized to update this course',
    });
  }

  // Update course
  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: 'Course updated successfully',
    data: {
      course,
    },
  });
});

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Course Instructor, Admin)
export const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

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
      error: 'Not authorized to delete this course',
    });
  }

  // Delete all lessons
  await Lesson.deleteMany({ courseId: req.params.id });

  // Delete course
  await course.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Course deleted successfully',
  });
});

// @desc    Get instructor's courses
// @route   GET /api/courses/instructor/my-courses
// @access  Private (Instructor, Admin)
export const getMyCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({ instructor: req.user.id })
    .populate('instructor', 'name avatar')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: {
      courses,
    },
  });
});

