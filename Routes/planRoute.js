import express from 'express';
import { requireSignIn } from '../Middlewares/authMiddleware.js'
import { create, getplans, remove, update } from '../Controllers/planControllers.js';




const router = express.Router()

router.post("/create", requireSignIn, create)

router.get('/getplans', getplans)

router.put('/update/:planId', update)

router.delete('/remove/:planId', requireSignIn, remove)
// router.get("/admin-auth", requireSignIn, (req, res) => {
//     res.status(200).send({ ok: true });
// });
export default router;