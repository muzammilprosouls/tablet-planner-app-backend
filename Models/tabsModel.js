import mongoose from "mongoose";

const tabsSchema = new mongoose.Schema(
    {
        label: {
            type: String,
            required: true,
        },
        color: {
            type: String,
            required: true
        },
        Imagebackground: {
            type: String,
            required: true
        },
        is_active: {
            type: Boolean,
        },
        is_system_generated: {
            type: Boolean,
            default: false,
            required: true
        },
        logs: {
            type: Boolean,
        },
        person: {
            type: mongoose.ObjectId,
            ref: "users",
        }
    },
    {
        timestamps: true
    }
)

export default mongoose.model("tabs", tabsSchema);