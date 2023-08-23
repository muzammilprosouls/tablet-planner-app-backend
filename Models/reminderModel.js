import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema(
    {
        taskId: {
            type: mongoose.ObjectId,
            ref: "tasks",
        },
        title: {
            type: String,
        },
        remiderDate: {
            type: String,
            required: true,
        },
        remiderTime: {
            type: String,
            required: true,
        },
        expotoken: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);
reminderSchema.pre("save", function (next) {
    if (!this.taskId) {
        this.taskId = undefined;
    }
    next();
});
export default mongoose.model("reminders", reminderSchema);