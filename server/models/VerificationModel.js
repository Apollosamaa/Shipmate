import mongoose from "mongoose";

const verificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    studentId: {
        type: String,
        required: true,
        uppercase: true,
        unique: true
    },
    programCode: {
        type: String,
        required: true,
        uppercase: true
    },
    intakeYear: Number,
    intakeMonth: Number,
    schoolEmail: {
        type: String,
        lowercase: true,
        unique: true,
        sparse: true
    },
    verifiedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Verification = mongoose.model("Verification", verificationSchema);

export default Verification;