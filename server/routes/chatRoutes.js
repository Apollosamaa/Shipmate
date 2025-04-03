import express from 'express';
import { 
    sendMessage, 
    getConversation,
    getConversations,
    markMessagesAsRead,
} from '../controllers/chatController.js';
import protect from '../middleware/protect.js';

const router = express.Router();

router.post("/messages", protect, sendMessage);

router.get("/conversations", protect, getConversations);

router.get("/:userId", protect, getConversation);

router.patch("/messages/mark-read", protect, markMessagesAsRead);

export default router;