import { Expo } from 'expo-server-sdk';
import reminderModel from './Models/reminderModel.js';

const expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });

export async function sendNotification(user, reminder) {
    const { title, expotoken, selectedSlot, StartingTime, EndingTime, location } = reminder;

    const message = {
        to: expotoken,
        sound: 'default',
        body: `Appointment: ${reminder.title}\nAppointment:${selectedSlot.slotTitle}\n${reminder.location && reminder.location.city ? `\nLocation: ${formatLocation(reminder.location)}` : ''}`,
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