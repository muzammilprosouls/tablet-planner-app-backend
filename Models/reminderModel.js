import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema(
    {
        taskId: {
            type: mongoose.ObjectId,
            ref: "tasks",
        },
        person: {
            type: mongoose.ObjectId,
            ref: "users",
        },
        title: {
            type: String,
        },

        StartingTime: {
            type: String,
            required: true,
        },
        EndingTime: {
            type: String,
            required: true,
        },
        selectedSlot: {
            id: Number,
            slotTitle: String,
            StartingTime: String,
            EndingTime: String,
        },
        expotoken: {
            type: String,
            required: true
        },
        // location: {
        //     type: [String],

        // }
        location: {
            city: String,
            country: String,
            district: String,
            isoCountryCode: String,
            name: String,
            postalCode: String,
            region: String,
            street: String,
            streetNumber: String,
            subregion: String,
            timezone: String
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