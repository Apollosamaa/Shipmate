import asyncHandler from "express-async-handler";
import { Message } from "../models/MessageModel.js";
import User from "../models/UserModel.js";

// Send a message
export const sendMessage = asyncHandler(async (req, res) => {
    const { receiverId, content, serviceId } = req.body;
    const senderId = req.user._id; // From auth middleware

    // Validate participants
    const receiver = await User.findById(receiverId);
    if (!receiver) {
        return res.status(404).json({ message: "Recipient not found" });
    }

    // Create message
    const message = await Message.create({
        sender: senderId,
        receiver: receiverId,
        service: serviceId,
        content
    });

    res.status(201).json(message);
});

// Get conversation between two users
export const getConversation = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    const messages = await Message.find({
        $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId }
        ]
    })
    .sort({ createdAt: 1 })
    .populate("sender", "name profilePicture")
    .populate("receiver", "name profilePicture");

    res.status(200).json(messages);
});

// Get all user's conversations
export const getConversations = asyncHandler(async (req, res) => {
    console.log("GET /conversations called"); // Debug log
    const userId = req.user._id;

    // Get unique conversation partners
    const conversations = await Message.aggregate([
        {
        $match: {
            $or: [
            { sender: userId },
            { receiver: userId }
            ]
        }
        },
        {
        $group: {
            _id: {
            $cond: [
                { $eq: ["$sender", userId] },
                "$receiver",
                "$sender"
            ]
            },
            lastMessage: { $last: "$$ROOT" },
            unreadCount: {
            $sum: {
                $cond: [
                { $and: [
                    { $eq: ["$receiver", userId] },
                    { $eq: ["$read", false] }
                ]},
                1,
                0
                ]
            }
            }
        }
        },
        {
        $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "user"
        }
        },
        { $unwind: "$user" }
    ]);

    res.status(200).json(conversations);
});

// Mark messages as read
export const markMessagesAsRead = asyncHandler(async (req, res) => {
    const { senderId } = req.body;
    const receiverId = req.user._id;
  
    await Message.updateMany(
      {
        sender: senderId,
        receiver: receiverId,
        read: false
      },
      { $set: { read: true } }
    );
  
    res.status(200).json({ success: true });
  });