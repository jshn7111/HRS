import express from 'express';
import { createReview, getReviewsByHotel } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:hotelId', getReviewsByHotel);
router.post('/:hotelId', protect, createReview);

export default router;
