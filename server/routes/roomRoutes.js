import express from 'express';
import {
  getRoomsByHotel,
  createRoom,
  updateRoom,
  deleteRoom,
} from '../controllers/roomController.js';
import { protect } from '../middleware/authMiddleware.js';
import { ownerOnly } from '../middleware/roleMiddleware.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

const router = express.Router({ mergeParams: true });

router.get('/:hotelId', asyncHandler(getRoomsByHotel));
router.post('/:hotelId', protect, ownerOnly, asyncHandler(createRoom));
router.put('/:id', protect, ownerOnly, asyncHandler(updateRoom));
router.delete('/:id', protect, ownerOnly, asyncHandler(deleteRoom));

export default router;
