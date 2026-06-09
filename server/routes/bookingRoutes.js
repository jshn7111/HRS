import express from 'express';
import {
  createBooking,
  getUserBookings,
  getOwnerBookings,
  updateBooking,
} from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';
import { ownerOnly } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/user', protect, getUserBookings);
router.get('/owner', protect, ownerOnly, getOwnerBookings);
router.put('/:id', protect, updateBooking);

export default router;
