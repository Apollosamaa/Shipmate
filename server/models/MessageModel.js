import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    receiver: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    service: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Service" 
    }, // Optional link to service
    content: {
        type: String,
        required: true,
        trim: true
    },
    read: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Index for faster querying
messageSchema.index({ sender: 1, receiver: 1 });
messageSchema.index({ createdAt: -1 });

export const Message = mongoose.model("Message", messageSchema);