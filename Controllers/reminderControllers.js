import taskModel from "../Models/taskModel.js";
import userModel from "../Models/userModel.js";
import notesModel from "../Models/notesModel.js";
import reminderModel from "../Models/reminderModel.js";
import { sendNotification } from "../notification-schedular.js";


export const createReminderController = async (req, res) => {
    try {
        const { taskId, taskTitle, formattedDate, formattedtime, expoPushToken, tappedAddress } = req.body;
        const userId = req.user._id;
        // console.log(tappedAddress)
        const existingUser = await userModel.findById(userId);
        if (!existingUser) {
            return res.status(404).send({
                success: false,
                message: "User not found",
            });
        }
        const locationData = {
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
        console.log(locationData)
        const reminder = await new reminderModel({
            taskId,
            title: taskTitle,
            remiderDate: formattedDate,
            remiderTime: formattedtime,
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
                remiderDate: reminder.remiderDate,
                remiderTime: reminder.remiderTime,
                expotoken: reminder.expotoken,
                location: reminder.location
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in creating Tasks",
            error,
        });
    }
}