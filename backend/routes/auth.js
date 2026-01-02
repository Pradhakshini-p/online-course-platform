// backend/routes/auth.js
import express from 'express';
import {
  register,
  login,
  refreshToken,
  getMe,
  logout,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);

// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

export default router;
