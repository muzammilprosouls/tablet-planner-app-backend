import express from 'express';
import { requireSignIn } from '../Middlewares/authMiddleware.js'
import { getUsersController } from '../Controllers/adminControllers.js';



const router = express.Router()

router.get('/getusers', getUsersController)

export default router;