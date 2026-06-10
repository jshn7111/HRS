import express from 'express';
import { createPayment, verifyPayment } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

const router = express.Router();

router.post('/', protect, asyncHandler(createPayment));
router.post('/verify', protect, asyncHandler(verifyPayment));

export default router;
