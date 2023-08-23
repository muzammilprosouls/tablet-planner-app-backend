import { Expo } from 'expo-server-sdk';
import reminderModel from './Models/reminderModel.js';

const expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });

export async function sendNotification(user, reminder) {
    const { expotoken, remiderDate, remiderTime } = reminder;

    // Calculate the exact notification time (adjust as needed)
    const notificationTime = new Date(`${remiderDate}${remiderTime}`);
    const currentTime = new Date();
    const timeDifference = notificationTime - currentTime;


    const isReminderClose = timeDifference <= 5 * 60 * 1000;

    if (isReminderClose) {
        console.log("3")
        const message = {
            to: expotoken,
            sound: 'default',
            body: `Reminder: ${reminder.title}`,
            // ... other notification details
        };

        const chunks = expo.chunkPushNotifications([message]);
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
}