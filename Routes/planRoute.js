import express from 'express';
import { requireSignIn } from '../Middlewares/authMiddleware.js'




const router = express.Router()

router.post("/create",)

router.get('/getplans', requireSignIn,)

router.put('/update-plan/:planId',)

router.delete('/remove-plan/:planId',)
// router.get("/admin-auth", requireSignIn, (req, res) => {
//     res.status(200).send({ ok: true });
// });
export default router;