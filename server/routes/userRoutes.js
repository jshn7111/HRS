import express from 'express';
import { getProfile, updateProfile, getAllUsers } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/me', protect, getProfile);
router.put('/me', protect, updateProfile);
router.get('/', protect, adminOnly, getAllUsers);

export default router;
