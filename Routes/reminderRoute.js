import express from 'express';
import { requireSignIn } from '../Middlewares/authMiddleware.js';
import { createReminderController, deleteReminderController, getRemindersController, updateReminderController } from '../Controllers/reminderControllers.js';

const router = express.Router()


router.post('/create', requireSignIn, createReminderController)

router.get("/user-reminders/:userId", getRemindersController);

router.put('/update-reminder/:reminderId', requireSignIn, updateReminderController);

router.delete('/remove-reminder/:reminderId', deleteReminderController)

export default router;




