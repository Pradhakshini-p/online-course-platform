// backend/controllers/authController.js
import User from '../models/User.js';
import { generateTokens, generateAccessToken, verifyRefreshToken } from '../utils/jwt.js';
import { asyncHandler } from '../utils/helpers.js';
import { validateEmail, validatePassword } from '../utils/validators.js';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Validation
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Please provide name, email, and password',
    });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({
      success: false,
      error: 'Please provide a valid email',
    });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({
      success: false,
      error: 'Password must be at least 6 characters',
    });
  }

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({
      success: false,
      error: 'User already exists with this email',
    });
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role: role && ['student', 'instructor', 'admin'].includes(role) ? role : 'student',
  });

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user._id);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        skills: user.skills,
      },
      accessToken,
      refreshToken,
    },
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Please provide email and password',
    });
  }

  // Check for user (include password for comparison)
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'Invalid credentials',
    });
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      error: 'Invalid credentials',
    });
  }

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user._id);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        skills: user.skills,
      },
      accessToken,
      refreshToken,
    },
  });
});

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken: token } = req.body;

  if (!token) {
    return res.status(400).json({
      success: false,
      error: 'Please provide refresh token',
    });
  }

  try {
    // Verify refresh token
    const decoded = verifyRefreshToken(token);

    // Generate new access token
    const accessToken = generateAccessToken(decoded.userId);

    res.status(200).json({
      success: true,
      data: {
        accessToken,
      },
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired refresh token',
    });
  }
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

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
    },
  });
});

// @desc    Logout user (client-side token removal, but keeping for consistency)
// @route   POST /api/auth/logout
// @access  Private
export const logout = asyncHandler(async (req, res) => {
  // In a stateless JWT system, logout is handled client-side by removing tokens
  // But we can add token blacklisting here if needed in the future
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

