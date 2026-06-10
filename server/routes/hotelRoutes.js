import express from 'express';
import {
  getHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
} from '../controllers/hotelController.js';
import { protect } from '../middleware/authMiddleware.js';
import { ownerOnly } from '../middleware/roleMiddleware.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

const router = express.Router();

router.get('/', asyncHandler(getHotels));
router.get('/:id', asyncHandler(getHotelById));
router.post('/', protect, ownerOnly, asyncHandler(createHotel));
router.put('/:id', protect, ownerOnly, asyncHandler(updateHotel));
router.delete('/:id', protect, ownerOnly, asyncHandler(deleteHotel));

export default router;
