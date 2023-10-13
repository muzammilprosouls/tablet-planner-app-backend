import AppointmentModel from '../Models/AppointmentModel'

export const createAppointmentController = async () => {
    try {
        const { startingTime, endingTime, title, bookingDate, isBooked } = req.body;
        const userId = req.user._id;
        const existingUser = await userModel.findById(userId);
        if (!existingUser) {
            return res.status(404).send({
                success: false,
                message: "User not found",
            });
        }

        const Appointment = await new AppointmentModel({
            startingTime,
            endingTime,
            title,
            bookingDate,
            isBooked,
            person: userId
        }).save();

        res.status(201).send({
            success: true,
            message: "Appointment Successfully created",
            Appointment
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in creating Appointment",
            error,
        });
    }
}