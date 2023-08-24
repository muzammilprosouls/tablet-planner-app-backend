import taskModel from "../Models/taskModel.js";
import userModel from "../Models/userModel.js";
import notesModel from "../Models/notesModel.js";
import reminderModel from "../Models/reminderModel.js";
import { sendNotification } from "../notification-schedular.js";


export const createReminderController = async (req, res) => {
    try {
        const { taskId, taskTitle, formattedDate, formattedtime, expoPushToken } = req.body;
        const userId = req.user._id;
        console.log("date", formattedDate);
        console.log("time", formattedtime);
        // if (!formattedDate) {
        //     return res.status(401).send({
        //         message: "Date is required",
        //     });
        // }
        // if (!formattedtime) {
        //     return res.status(401).send({
        //         message: "Time is required",
        //     });
        // }
        const existingUser = await userModel.findById(userId);
        if (!existingUser) {
            return res.status(404).send({
                success: false,
                message: "User not found",
            });
        }
        const reminder = await new reminderModel({
            taskId,
            title: taskTitle,
            remiderDate: formattedDate,
            remiderTime: formattedtime,
            expotoken: expoPushToken,
            person: userId
        }).save();

        // // Schedule a notification here
        // const user = await userModel.findById(userId);
        // if (user) {
        //     // Pass necessary data to the sendNotification function
        //     sendNotification(user, reminder);
        // }

        res.status(201).send({
            success: true,
            message: "reminder Successfully created",
            reminder: {
                _id: reminder._id,
                taskId: reminder.taskId,
                title: reminder.title,
                remiderDate: reminder.remiderDate,
                remiderTime: reminder.remiderTime,
                expotoken: reminder.expotoken
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
// export async function getUpcomingReminders() {
//     try {
//         const currentTime = new Date();

//         // Fetch reminders where reminderTime is greater than the current time
//         const upcomingReminders = await ReminderModel.find({
//             reminderTime: { $gt: currentTime },
//         }).exec();

//         return upcomingReminders;
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// }