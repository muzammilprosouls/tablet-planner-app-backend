import express from 'express';
import { requireSignIn } from '../Middlewares/authMiddleware.js'
import { changeStatus, getUsers, login } from '../Controllers/adminControllers.js';



const router = express.Router()

router.post("/login", login)

router.get('/getusers', requireSignIn, getUsers)

router.patch('/change-status/:UserId', changeStatus)

router.get("/admin-auth", requireSignIn, (req, res) => {
    res.status(200).send({ ok: true });
});
export default router;