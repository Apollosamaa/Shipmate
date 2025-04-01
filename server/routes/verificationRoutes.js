import express from 'express';
import { verifyStudent, checkVerificationStatus } from '../controllers/verificationController.js';
import protect from '../middleware/protect.js';

const router = express.Router();

router.post('/verify', protect, verifyStudent);
router.get('/verify/status', protect, checkVerificationStatus); // New endpoint

export default router;