import taskModel from "../Models/taskModel.js";
import userModel from "../Models/userModel.js";
import notesModel from "../Models/tabsModel.js";
import reminderModel from "../Models/reminderModel.js";
import { sendNotification } from "../notification-schedular.js";


export const createReminderController = async (req, res) => {
    try {
        const { taskId, taskTitle,
            // formattedDate,
            // StartingTime, EndingTime,
            converted, selectedSlot, expoPushToken, tappedAddress } = req.body;
        const userId = req.user._id;

        // console.log(tappedAddress)
        // console.log(formattedDate, "date");
        // console.log(StartingTime, "STime");
        // console.log(EndingTime, "ETime");
        console.log(converted)
        const existingUser = await userModel.findById(userId);
        if (!existingUser) {
            return res.status(404).send({
                success: false,
                message: "User not found",
            });
        }
        const appointmentClash = await reminderModel.findOne({
            person: userId,
            // remiderDate: formattedDate,
            StartingTime: converted.startingTime,
            EndingTime: converted.endingTime,
        });
        console.log(appointmentClash, "clashdoc")
        if (appointmentClash) {
            return res.status(400).send({
                success: false,
                message: "Appointment already exists for this time slot",
            });
        }
        let locationData = {};
        if (tappedAddress && tappedAddress.length > 0) {
            locationData = {
                city: tappedAddress[0].city,
                country: tappedAddress[0].country,
                district: tappedAddress[0].district,
                isoCountryCode: tappedAddress[0].isoCountryCode,
                name: tappedAddress[0].name,
                postalCode: tappedAddress[0].postalCode,
                region: tappedAddress[0].region,
                street: tappedAddress[0].street,
                streetNumber: tappedAddress[0].streetNumber,
                subregion: tappedAddress[0].subregion,
                timezone: tappedAddress[0].timezone
            };
        }
        const reminder = await new reminderModel({
            taskId,
            title: taskTitle,
            // remiderDate: formattedDate,
            StartingTime: converted.startingTime,
            EndingTime: converted.endingTime,
            selectedSlot,
            expotoken: expoPushToken,
            location: locationData,
            person: userId
        }).save();

        res.status(201).send({
            success: true,
            message: "reminder Successfully created",
            reminder: {
                _id: reminder._id,
                taskId: reminder.taskId,
                person: reminder.person,
                title: reminder.title,
                selectedSlot: reminder.selectedSlot,
                // remiderDate: reminder.remiderDate,
                StartingTime: reminder.StartingTime,
                EndingTime: reminder.EndingTime,
                expotoken: reminder.expotoken,
                location: reminder.location
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in creating Reminder",
            error,
        });
    }
};

export const getRemindersController = async (req, res) => {
    const { userId } = req.params;
    try {
        const reminders = await reminderModel.find({ person: userId }).exec();
        res.status(200).send(reminders);
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in getting Reminders",
            error,
        });
    }
};

export const updateReminderController = async (req, res) => {
    const { reminderId } = req.params;
    const { taskId, taskTitle,
        // formattedDate,
        // StartingTime, EndingTime,
        converted, selectedSlot, expoPushToken, tappedAddress } = req.body;
    console.log(converted, "clg")
    const userId = req.user._id;
    try {
        const existingreminder = await reminderModel.findById(reminderId);

        if (!existingreminder) {
            return res.status(404).json({
                success: false,
                message: "reminder not found",
            });
        }
        const appointmentClash = await reminderModel.findOne({
            person: userId,
            // remiderDate: formattedDate,
            StartingTime: converted.startingTime,
            EndingTime: converted.endingTime,
        });
        console.log(appointmentClash, "clashdoc")
        if (appointmentClash) {
            return res.status(400).send({
                success: false,
                message: "Appointment already exists for this time slot",
            });
        }
        let locationData = {};
        if (tappedAddress && tappedAddress.length > 0) {
            locationData = {
                city: tappedAddress[0].city,
                country: tappedAddress[0].country,
                district: tappedAddress[0].district,
                isoCountryCode: tappedAddress[0].isoCountryCode,
                name: tappedAddress[0].name,
                postalCode: tappedAddress[0].postalCode,
                region: tappedAddress[0].region,
                street: tappedAddress[0].street,
                streetNumber: tappedAddress[0].streetNumber,
                subregion: tappedAddress[0].subregion,
                timezone: tappedAddress[0].timezone
            };
        }
        const updatedReminder = await reminderModel.findByIdAndUpdate(
            reminderId,
            {
                title: taskTitle || existingreminder.title,
                selectedSlot: selectedSlot || existingreminder.selectedSlot,
                StartingTime: converted.startingTime || existingreminder.StartingTime,
                EndingTime: converted.endingTime || existingreminder.EndingTime,
                // remiderDate: formattedDate || existingreminder.remiderDate,
                // remiderTime: formattedtime || existingreminder.remiderTime,
                expotoken: expoPushToken || existingreminder.expotoken,
                location: locationData || existingreminder.location
            },
            { new: true }
        );
        console.log(updatedReminder)
        res.status(200).json({
            success: true,
            message: "Reminder successfully updated",
            reminder: updatedReminder,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error updating Reminder",
            error,
        });
    }
};

export const deleteReminderController = async (req, res) => {
    const { reminderId } = req.params;

    try {
        const deletedReminder = await reminderModel.findByIdAndDelete(reminderId);
        if (!deletedReminder) {
            return res.status(404).json({
                success: false,
                message: "Reminder not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Reminder successfully deleted",
            reminder: deletedReminder,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error in deleting Reminder",
            error,
        });
    }
};