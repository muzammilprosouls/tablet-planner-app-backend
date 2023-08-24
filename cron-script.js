// import { cron } from 'cron-node'
// import reminderModel from './Models/reminderModel'
// import userModel from './Models/userModel';

// // Schedule a cron job to run every minute
// // Schedule the cron job to run every minute
// const job = new CronJob('* * * * *', async () => {
//     try {
//         const currentDate = new Date(); // Get the current date and time
//         console.log('Cron job running at:', currentDate);

//         // Query reminders from MongoDB where notification time matches the current time
//         const currentTime = currentDate.getTime(); // Get the current time in milliseconds
//         const reminders = await reminderModel.find({
//             remiderDate: { $lte: currentDate }, // Reminders for today or earlier
//             remiderTime: { $gte: currentTime } // Reminders with time greater than or equal to the current time
//         });

//         // Send notifications for matching reminders
//         for (const reminder of reminders) {
//             const user = await userModel.findById(reminder.userId); // Replace with your logic to fetch the user
//             if (user) {
//                 // Pass necessary data to the sendNotification function
//                 await sendNotification(user, reminder);
//             }
//         }
//     } catch (error) {
//         console.error('Error in cron job:', error);
//     }
// });

// job.start();