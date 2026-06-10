import express from 'express';
import { loginUser, registerUser, getCurrentUser } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

const router = express.Router();

router.post('/login', asyncHandler(loginUser));
router.post('/register', asyncHandler(registerUser));
router.get('/me', protect, asyncHandler(getCurrentUser));

export default router;
