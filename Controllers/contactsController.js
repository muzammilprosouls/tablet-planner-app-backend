import contactModel from "../Models/contactModel.js";
import userModel from "../Models/userModel.js";
export const saveimportedcontacts = async (req, res) => {
    try {
        const contacts = req.body.savecontacts;
        const userId = req.user._id;
        const existingContacts = await contactModel.find({ person: userId });
        console.log(contacts[0].addresses);

        const concatenateAddressFields = (address) => {

            const cleanedStreet = address.street.replace(/\n/g, '');
            const fieldsToConcatenate = [
                cleanedStreet,
                address.city,
                address.country,
                address.postalCode,
            ];
            return fieldsToConcatenate.filter(Boolean).join(', '); // Filter out empty fields and join with ', '
        };

        // Add userId to each contact object
        if (existingContacts.length === 0) {
            // If no existing contacts, proceed to save new contacts
            const contactsWithUserId = contacts.map(contact => ({
                ...contact,
                person: userId,
                contactId: contact.id || undefined, // Use 'id' if provided, else undefined (let Mongoose generate)
                addresses: contact.addresses.map(address => ({
                    address: concatenateAddressFields(address), // Concatenate and store address as a single string
                })),
            }));

            const savedContacts = await contactModel.insertMany(contactsWithUserId);

            return res.status(201).send({
                success: true,
                message: 'Contacts saved successfully.',
                savedContacts
            });
        } else {
            // If existing contacts found, return an error message
            return res.status(400).send({
                success: false,
                message: 'Contacts already exist for this user.',
            });
        }
    } catch (error) {
        console.error('Error while saving contacts:', error);
        res.status(500).json({ error: 'Failed to save contacts.' });
    };
}
export const createContactsController = async (req, res) => {
    try {
        const { firstName, lastName, company, address, emails, phoneNumbers, displayimg, name, note, dob } = req.body;
        const userId = req.user._id;
        console.log("create Note", dob)
        if (!firstName) {
            return res.status(401).send({
                message: "First Name is required",
            });
        }
        const existingUser = await userModel.findById(userId);
        if (!existingUser) {
            return res.status(404).send({
                success: false,
                message: "User not found",
            });
        }
        const contact = await new contactModel({
            firstName,
            lastName,
            company,
            addresses: address,
            emails,
            phoneNumbers,
            rawImage: displayimg,
            name,
            note,
            birthday: dob,
            person: userId,
        }).save();
        res.status(201).send({
            success: true,
            message: "Contact Successfully Saved",
            contact
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in creating Contact",
            error,
        });
    }
}
export const getContactController = async (req, res) => {
    try {
        const { userId } = req.params;
        const contacts = await contactModel.find({ person: userId }).exec();
        res.status(200).send(contacts);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error in getting Contacts",
            error: error.message,
        });
    }
}
export const updateContactController = async (req, res) => {
    try {
        const { contactId } = req.params;
        const { firstName, lastName, company, address, emails, phoneNumbers, displayimg, name, note, dob } = req.body;
        const existingContact = await contactModel.findById(contactId);
        console.log("dob", dob)
        if (!existingContact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found",
            });
        }
        const birthday = dob;
        const addresses = address;
        const rawImage = displayimg;
        const updatedContact = await contactModel.findByIdAndUpdate(
            contactId,
            {
                firstName: firstName || existingContact.firstName,
                lastName: lastName || existingContact.lastName,
                company: company || existingContact.companyName,
                addresses: addresses || existingContact.addresses,
                emails: emails || existingContact.emails,
                phoneNumbers: phoneNumbers || existingContact.phoneNumbers,
                rawImage: rawImage || existingContact.rawImage,
                name: name || existingContact.name,
                note: note || existingContact.note,
                birthday: birthday || existingContact.birthday
            },
            { new: true }
        );
        console.log(updatedContact)
        res.status(200).json({
            success: true,
            message: "Contact successfully updated",
            contact: updatedContact,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error updating Contact",
            error,
        });
    }
}
export const deleteContactController = async (req, res) => {
    try {
        const { contactId } = req.params;
        const deletedContact = await contactModel.findByIdAndDelete(contactId);
        if (!deletedContact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Contact successfully deleted",
            contact: deletedContact,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error in deleting activity",
            error,
        });
    }
}