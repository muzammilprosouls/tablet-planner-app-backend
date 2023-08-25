import express from 'express';
import colors from 'colors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDb from './config/db.js';
import authRoute from './Routes/authRoute.js';
import taskRoute from './Routes/taskRoute.js'
import notesRoute from './Routes/notesRoute.js'
import reminderRoute from './Routes/reminderRoute.js'
import cors from 'cors';
import * as cron from 'node-cron'
import { sendNotification } from './notification-schedular.js';
import reminderModel from './Models/reminderModel.js';
import userModel from './Models/userModel.js';
// import path from 'path'


//config .env
dotenv.config();

//config database
connectDb();

//rest object
const app = express()

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
// app.use(express.static(path.join(__dirname, './client/build')))

//routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/tasks", taskRoute);
app.use("/api/v1/notes", notesRoute);
app.use("/api/v1/reminder", reminderRoute);

// app.use('*', function (req, res) {
//     res.sendFile(path.join(__dirname, "./client/build/index.html"));
// })

app.get('/', (req, res) => {
    res.send("<h1>Welcome to Tablet Planner app</h1>");
});

// Query reminders from MongoDB where notification time matches the current time
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

// job.start();
const PORT = process.env.PORT || 8080;
connectDb().then(() => {
    app.listen(PORT, () => {
        console.log(`Server ${process.env.DEV_MODE} Running on ${PORT}`.bgCyan.white);
        job.start();
    })
})