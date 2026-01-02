// backend/middleware/auth.js
import { verifyAccessToken } from '../utils/jwt.js';
import User from '../models/User.js';
import { asyncHandler } from '../utils/helpers.js';

// Protect routes - verify JWT token
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route',
    });
  }

  try {
    // Verify token
    const decoded = verifyAccessToken(token);

    // Get user from token (exclude password)
    req.user = await User.findById(decoded.userId).select('-password');

    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'User not found',
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route',
    });
  }
});

// Grant access to specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `User role '${req.user.role}' is not authorized to access this route`,
      });
    }

    next();
  };
};

