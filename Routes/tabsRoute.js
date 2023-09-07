import express from 'express';
import { createTabsController, deleteTabController, getTabsController, updateTabController } from '../Controllers/tabsController.js';
import { requireSignIn } from '../Middlewares/authMiddleware.js';

const router = express.Router()


router.post("/create", requireSignIn, createTabsController);

router.get("/getTabs/:userId", getTabsController);

router.put('/update-tab/:tabId', requireSignIn, updateTabController);

router.delete('/remove-tab/:tabId', deleteTabController)

export default router;