// backend/routes/reviews.js
import express from 'express';
import {
  addReview,
  getCourseReviews,
  updateReview,
  deleteReview,
} from '../controllers/reviewController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public route
router.get('/course/:courseId', getCourseReviews);

// Protected routes
router.post('/', protect, authorize('student', 'admin'), addReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

export default router;

