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

const router = express.Router();

router.get('/', getHotels);
router.get('/:id', getHotelById);
router.post('/', protect, ownerOnly, createHotel);
router.put('/:id', protect, ownerOnly, updateHotel);
router.delete('/:id', protect, ownerOnly, deleteHotel);

export default router;
