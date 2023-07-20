import express from 'express';
import { createTasksController, deleteTaskController, getTasksController, updateTaskController } from '../Controllers/taskControllers.js';
import { requireSignIn } from '../Middlewares/authMiddleware.js';



const router = express.Router()


router.post('/create', requireSignIn, createTasksController)

router.get("/user-tasks/:userId", getTasksController);

router.put('/update-task/:taskId', requireSignIn, updateTaskController);

router.delete('/remove-task/:taskId', deleteTaskController)


export default router;