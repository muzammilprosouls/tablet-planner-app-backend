import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema(
    {
        StartingTime: {
            type: String,
        },
        EndingTime: {
            type: String,
        },
        title: {
            type: String,
        },
        BookingDate: {
            type: String,
        },
        isBooked: {
            type: Boolean
        }
    },
    { timestamps: true }
);

export default mongoose.model("Appointments", AppointmentSchema);