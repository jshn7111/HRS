import express from 'express';
import {
  createBooking,
  getUserBookings,
  getOwnerBookings,
  updateBooking,
} from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';
import { ownerOnly } from '../middleware/roleMiddleware.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

const router = express.Router();

router.post('/', protect, asyncHandler(createBooking));
router.get('/user', protect, asyncHandler(getUserBookings));
router.get('/owner', protect, ownerOnly, asyncHandler(getOwnerBookings));
router.put('/:id', protect, asyncHandler(updateBooking));

export default router;
