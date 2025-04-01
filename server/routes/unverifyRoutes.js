import express from 'express';
import User from '../models/UserModel.js';
import Verification from '../models/VerificationModel.js';
import protect from '../middleware/protect.js';

const router = express.Router();

// Testing endpoint - unverify user
router.post('/unverify', protect, async (req, res) => {
    try {
        const user = await User.findOne({ auth0Id: req.oidc.user.sub });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Remove verification
        await Verification.deleteOne({ userId: user._id });
        
        // Update user status
        user.isVerified = false;
        await user.save();

        return res.json({ 
            success: true,
            message: 'User unverified successfully',
            user: {
                _id: user._id,
                isVerified: user.isVerified
            }
        });

    } catch (error) {
        console.error('Unverify error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;