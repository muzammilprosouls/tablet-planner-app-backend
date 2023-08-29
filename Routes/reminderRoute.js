import express from 'express';
import { requireSignIn } from '../Middlewares/authMiddleware.js';
import { createReminderController, getRemindersController } from '../Controllers/reminderControllers.js';

const router = express.Router()


router.post('/create', requireSignIn, createReminderController)

router.get("/user-reminders/:userId", getRemindersController);

export default router;

// router.put('/update-task/:taskId', requireSignIn, updateTaskController);

// router.delete('/remove-task/:taskId', deleteTaskController)
