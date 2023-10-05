import mongoose from "mongoose";

const emailSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    label: {
        type: String,
    },
    id: {
        type: String,
    },
});
const phoneNumberSchema = new mongoose.Schema({
    countryCode: {
        type: String,
    },
    digits: {
        type: String,
    },
    label: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true
    }
});
// const addressSchema = new mongoose.Schema({
//     city: String,
//     country: String,
//     id: String,
//     isoCountryCode: String,
//     label: String,
//     postalCode: String,
//     region: String,
//     street: String,
// });
const contactSchema = new mongoose.Schema(
    {
        contactId: {
            type: String
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
        },
        company: {
            type: String
        },
        name: {
            type: String,
        },
        addresses: [{
            address: String,
        }],
        emails: [emailSchema],
        rawImage: {
            uri: {
                type: String,
            },
            width: {
                type: Number
            },
            height: {
                type: Number
            },
        },
        phoneNumbers: [phoneNumberSchema],
        note: {
            type: String
        },

        birthday: {
            month: String,
            day: String,
            year: Number
        },
        person: {
            type: mongoose.ObjectId,
            ref: "users",
        }
    }
)
export default mongoose.model("contacts", contactSchema);

