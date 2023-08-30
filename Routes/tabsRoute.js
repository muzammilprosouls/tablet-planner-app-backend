import express from 'express';
import { getTabsController } from '../Controllers/tabsController.js';






const router = express.Router()




router.get("/getTabs", getTabsController);




export default router;