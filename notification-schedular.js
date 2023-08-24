import { Expo } from 'expo-server-sdk';
import reminderModel from './Models/reminderModel.js';

const expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });

export async function sendNotification(user, reminder) {
    const { title, expotoken, remiderDate, remiderTime } = reminder;

    const message = {
        to: expotoken,
        sound: 'default',
        body: `Reminder: ${reminder.title}`,
        // ... other notification details
    };

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