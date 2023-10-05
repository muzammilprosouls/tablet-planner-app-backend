import express from 'express';
// import { requireSignIn } from '../Middlewares/authMiddleware.js'
import { getContactController, saveimportedcontacts, deleteContactController, updateContactController, createContactsController } from '../Controllers/contactsController.js';
import { requireSignIn } from '../Middlewares/authMiddleware.js';

const router = express.Router()

router.post("/save", requireSignIn, saveimportedcontacts);

router.post('/create', requireSignIn, createContactsController)

router.get("/getContacts/:userId", getContactController);

router.put('/update-contact/:contactId', requireSignIn, updateContactController);

router.delete('/remove-Contact/:contactId', deleteContactController)


export default router;