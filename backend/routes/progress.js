// backend/routes/progress.js
import express from 'express';
import {
  markLessonComplete,
  getCourseProgress,
  getProgressOverview,
} from '../controllers/progressController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Student routes
router.post('/complete', authorize('student', 'admin'), markLessonComplete);
router.get('/course/:courseId', getCourseProgress);
router.get('/overview', authorize('student', 'admin'), getProgressOverview);

export default router;

