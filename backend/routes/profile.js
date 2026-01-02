// backend/routes/profile.js
import express from 'express';
import {
  getMyProfile,
  updateProfile,
  getPublicProfile,
} from '../controllers/profileController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public route
router.get('/:userId', getPublicProfile);

// Protected routes
router.get('/', protect, getMyProfile);
router.put('/', protect, updateProfile);

export default router;

