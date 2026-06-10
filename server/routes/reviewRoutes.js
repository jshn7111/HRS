import express from 'express';
import { createReview, getReviewsByHotel } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

const router = express.Router();

router.get('/:hotelId', asyncHandler(getReviewsByHotel));
router.post('/:hotelId', protect, asyncHandler(createReview));

export default router;
