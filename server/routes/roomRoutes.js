import express from 'express';
import {
  getRoomsByHotel,
  createRoom,
  updateRoom,
  deleteRoom,
} from '../controllers/roomController.js';
import { protect } from '../middleware/authMiddleware.js';
import { ownerOnly } from '../middleware/roleMiddleware.js';

const router = express.Router({ mergeParams: true });

router.get('/:hotelId', getRoomsByHotel);
router.post('/:hotelId', protect, ownerOnly, createRoom);
router.put('/:id', protect, ownerOnly, updateRoom);
router.delete('/:id', protect, ownerOnly, deleteRoom);

export default router;
