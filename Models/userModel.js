import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        role: {
            type: Boolean
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
        },
        DOB: {
            type: Date,
        },
        plans: {
            type: mongoose.ObjectId,
            ref: "Plans",
        },
        is_Active: {
            type: Boolean
        }
    },
    { timestamps: true }
);

export default mongoose.model("users", userSchema);