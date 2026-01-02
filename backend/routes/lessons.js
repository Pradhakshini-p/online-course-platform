// backend/routes/lessons.js
import express from 'express';
import {
  getLessons,
  getLesson,
  createLesson,
  updateLesson,
  deleteLesson,
} from '../controllers/lessonController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get lessons for a course (public route with limited info)
router.get('/courses/:courseId/lessons', getLessons);

// Protected routes
router.get('/:id', protect, getLesson);
router.post('/courses/:courseId/lessons', protect, createLesson);
router.put('/:id', protect, updateLesson);
router.delete('/:id', protect, deleteLesson);

export default router;

