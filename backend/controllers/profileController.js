// backend/controllers/profileController.js
import User from '../models/User.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import { asyncHandler } from '../utils/helpers.js';
import { validateEmail } from '../utils/validators.js';

// @desc    Get current user profile
// @route   GET /api/profile
// @access  Private
export const getMyProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  // Get enrolled courses count (for students)
  let enrolledCourses = [];
  if (user.role === 'student') {
    const enrollments = await Enrollment.find({ studentId: req.user.id })
      .populate('courseId', 'title thumbnail')
      .limit(5)
      .sort({ enrolledAt: -1 });
    enrolledCourses = enrollments.map((e) => ({
      courseId: e.courseId._id,
      title: e.courseId.title,
      thumbnail: e.courseId.thumbnail,
      enrolledAt: e.enrolledAt,
    }));
  }

  // Get created courses count (for instructors)
  let createdCourses = [];
  if (user.role === 'instructor' || user.role === 'admin') {
    const courses = await Course.find({ instructor: req.user.id })
      .select('title thumbnail enrolledCount averageRating')
      .limit(5)
      .sort({ createdAt: -1 });
    createdCourses = courses.map((c) => ({
      courseId: c._id,
      title: c.title,
      thumbnail: c.thumbnail,
      enrolledCount: c.enrolledCount,
      averageRating: c.averageRating,
    }));
  }

  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        skills: user.skills,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      enrolledCourses,
      createdCourses,
    },
  });
});

// @desc    Update profile
// @route   PUT /api/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, bio, skills, avatar } = req.body;

  // Build update object
  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (bio !== undefined) updateData.bio = bio;
  if (skills !== undefined) updateData.skills = skills;
  if (avatar !== undefined) updateData.avatar = avatar;

  // Update user
  const user = await User.findByIdAndUpdate(req.user.id, updateData, {
    new: true,
    runValidators: true,
  }).select('-password');

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        skills: user.skills,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    },
  });
});

// @desc    Get public profile of a user
// @route   GET /api/profile/:userId
// @access  Public
export const getPublicProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId).select(
    'name avatar bio skills role createdAt'
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found',
    });
  }

  // Get public stats
  let stats = {};
  if (user.role === 'instructor') {
    const courses = await Course.find({ instructor: user._id });
    stats = {
      totalCourses: courses.length,
      totalStudents: courses.reduce((sum, c) => sum + c.enrolledCount, 0),
      averageRating:
        courses.length > 0
          ? courses.reduce((sum, c) => sum + c.averageRating, 0) / courses.length
          : 0,
    };
  }

  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        avatar: user.avatar,
        bio: user.bio,
        skills: user.skills,
        role: user.role,
        createdAt: user.createdAt,
      },
      stats,
    },
  });
});

