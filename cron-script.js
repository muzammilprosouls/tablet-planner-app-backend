import * as cron from 'node-cron'
import reminderModel from './Models/reminderModel.js'
import userModel from './Models/userModel.js';
import mongoose from 'mongoose';
import colors from "colors";
import { Expo } from 'expo-server-sdk';


const connectDatabase = async () => {
    try {
        const conn = await mongoose.connect('mongodb+srv://muzammild:8oct1999@cluster1.nno2bku.mongodb.net/tablet-planner')
        console.log(`Connected To Mongodb ${conn.connection.host}`.bgMagenta.white);
    } catch (error) {
        console.log(`Error in Mongodb ${error}`.bgRed.white);
    }
}
// export c 
connectDatabase();
const job = cron.schedule('* * * * *', async () => {
    try {
        const currentDate = new Date();
        const currentTime = new Date();
        const formattedDate = (`${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`);
        const formattedtime = `T${currentTime.getHours()}:${currentTime.getMinutes().toString().padStart(2, '0')}:00.000Z`;
        console.log("date", formattedDate);
        console.log("time", formattedtime);
        // Query reminders from MongoDB where notification time matches the current time
        console.log('Cron job running at:', `${formattedDate}${formattedtime}`);
        const reminders = await reminderModel.find({
            remiderDate: formattedDate,
            remiderTime: formattedtime
        });
        console.log("reminder date and time", reminders)
        // Send notifications for matching reminders
        for (const reminder of reminders) {
            const user = await userModel.findById(reminder.person);
            if (user) {
                console.log("user")
                await sendNotification(user, reminder);
            }
        }
    } catch (error) {
        console.error('Error in cron job:', error);
    }
});
job.start();

const expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });

export async function sendNotification(user, reminder) {
    const { title, expotoken, remiderDate, remiderTime, location } = reminder;

    const message = {
        to: expotoken,
        sound: 'default',
        body: `Reminder: ${reminder.title}${reminder.location && reminder.location.city ? `\nLocation: ${formatLocation(reminder.location)}` : ''}`,
        // ... other notification details
    };
    function formatLocation(location) {
        const { streetNumber, street, city, country } = location;
        return `${streetNumber ? streetNumber + ' ' : ''}${street} ${city} ${country}`;
    }
    const chunks = expo.chunkPushNotifications([message]);
    const tickets = [];
    // Send the chunks to the Expo push notification service
    for (let chunk of chunks) {
        try {
            console.log('Sending notifications:', chunk);
            const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            console.log('Notification response:', ticketChunk);
            // Handle tickets and errors
            tickets.push(...ticketChunk);
        } catch (error) {
            console.error('Error sending notifications:', error); // Log the error
            if (error.details && error.details.error) {
                console.error('Error code:', error.details.error);
            }
        }
    }
}