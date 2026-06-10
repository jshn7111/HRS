import express from 'express';
import { getProfile, updateProfile, getAllUsers } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/roleMiddleware.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

const router = express.Router();

router.get('/me', protect, asyncHandler(getProfile));
router.put('/me', protect, asyncHandler(updateProfile));
router.get('/', protect, adminOnly, asyncHandler(getAllUsers));

export default router;
