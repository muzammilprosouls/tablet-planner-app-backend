import express from 'express';
import { requireSignIn } from '../Middlewares/authMiddleware.js';
import { createReminderController } from '../Controllers/reminderControllers.js';

const router = express.Router()


router.post('/create', requireSignIn, createReminderController)



export default router;

// router.get("/user-tasks/:userId", getTasksController);

// router.put('/update-task/:taskId', requireSignIn, updateTaskController);

// router.delete('/remove-task/:taskId', deleteTaskController)
