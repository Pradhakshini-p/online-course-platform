// backend/routes/courses.js
import express from 'express';
import {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  getMyCourses,
} from '../controllers/courseController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Protected routes (must come before /:id to avoid route conflicts)
router.get('/instructor/my-courses', protect, authorize('instructor', 'admin'), getMyCourses);
router.post('/', protect, authorize('instructor', 'admin'), createCourse);

// Public routes
router.get('/', getCourses);
router.get('/:id', getCourse);

// Protected routes
router.put('/:id', protect, updateCourse);
router.delete('/:id', protect, deleteCourse);

export default router;

