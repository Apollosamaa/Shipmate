import mongoose from 'mongoose';



const serviceSchema = new mongoose.Schema({

    title: { 
        type: String, 
        required: true, 
        trim: true 
    }, // Service name

    description: { 
        type: String, 
        required: true 
    }, // Detailed explanation of service

    category: { 
        type: String, 
        required: true 
    }, // Service type (e.g., "Academic", "Tech Support")

    tags: [{ 
        type: String 
    }], // Keywords for searching

    provider: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    }, 

    price: { 
        type: Number, 
        required: true 
    }, 

    negotiable: { 
        type: Boolean, 
        default: false 
    },

    applicants: [{ 
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
        status: { type: String, enum: ["pending", "accepted", "rejected", "completed"], default: "pending" }
    }],

    likes: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
    }],

    ratings: [{ 
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
        rating: { type: Number, min: 1, max: 5 }, 
        review: { type: String } 
    }],

    averageRating: { 
        type: Number, 
        default: 0 
    },

}, { timestamps: true });

const Service = mongoose.model("Service", serviceSchema);

export default Service;