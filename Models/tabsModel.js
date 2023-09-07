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
        person: {
            type: mongoose.ObjectId,
            ref: "users",
        }
    }
)

export default mongoose.model("tabs", tabsSchema);