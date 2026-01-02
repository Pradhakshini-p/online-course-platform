// backend/routes/analytics.js
import express from 'express';
import {
  getInstructorOverview,
  getCourseAnalytics,
} from '../controllers/analyticsController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected (Instructor/Admin only)
router.use(protect);
router.use(authorize('instructor', 'admin'));

router.get('/instructor/overview', getInstructorOverview);
router.get('/instructor/course/:courseId', getCourseAnalytics);

export default router;

