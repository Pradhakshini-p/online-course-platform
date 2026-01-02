// backend/routes/enrollments.js
import express from 'express';
import {
  enrollInCourse,
  getMyEnrollments,
  getEnrollmentStatus,
} from '../controllers/enrollmentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Student routes
router.post('/', authorize('student', 'admin'), enrollInCourse);
router.get('/my-courses', authorize('student', 'admin'), getMyEnrollments);
router.get('/:courseId/status', getEnrollmentStatus);

export default router;

