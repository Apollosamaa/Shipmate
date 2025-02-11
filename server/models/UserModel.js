import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    auth0Id: {
        type: String,
        required: true,
        unique: true,
    },

    appliedServices: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service",
        },
    ],

    savedServices: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service",
        }
    ],

    profilePicture: {
        type: String,
    },

    bio:{
        type: String,
        default: "no bio provided",
    },

    isVerified: {
        type: Boolean,
        default: false,
    },

    serviceRatings: [
        {
            service: { type: mongoose.Schema.Types.ObjectId, ref: "Service" }, // Which service was rated
            rating: { type: Number, required: true }, // 1-5 stars
            reviewer: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Who rated
            comment: { type: String }, // Optional feedback
        }
    ],

    providerRatings: [
        {
            rating: { type: Number, required: true }, // 1-5 stars
            reviewer: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Who rated
            comment: { type: String }, // Optional feedback
        }
    ],

    // Computed values
    averageServiceRating: {
        type: Number,
        default: 0,
    },

    averageProviderRating: {
        type: Number,
        default: 0,
    },

    overallRating: {
        type: Number,
        default: 0,
    },

}, { timestamps: true });

// Method to calculate the average of an array of ratings
userSchema.methods.calculateRatings = function () {
    // Compute average service rating
    if (this.serviceRatings.length > 0) {
        const totalService = this.serviceRatings.reduce((sum, r) => sum + r.rating, 0);
        this.averageServiceRating = totalService / this.serviceRatings.length;
    } else {
        this.averageServiceRating = 0;
    }

    // Compute average provider rating
    if (this.providerRatings.length > 0) {
        const totalProvider = this.providerRatings.reduce((sum, r) => sum + r.rating, 0);
        this.averageProviderRating = totalProvider / this.providerRatings.length;
    } else {
        this.averageProviderRating = 0;
    }

    // Compute overall rating (70% service quality + 30% provider reputation)
    this.overallRating = (0.7 * this.averageServiceRating) + (0.3 * this.averageProviderRating);

    return this.overallRating;
};

// Middleware to update ratings before saving
userSchema.pre("save", function (next) {
    this.calculateRatings();
    next();
});

const User = mongoose.model("User", userSchema);

export default User;