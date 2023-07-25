import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        person: {
            type: mongoose.ObjectId,
            ref: "users",
        },
        title: {
            type: String,
            required: true,
        },

        category: {
            type: String,
            required: true,
        },
        paths: {
            type: [mongoose.Schema.Types.Mixed]
        },
        recordings: {
            type: [mongoose.Schema.Types.Mixed]
        },
        // recordings: [
        //     {
        //         duration: {
        //             type: String,
        //             required: true,
        //         },
        //         file: {
        //             // data: Buffer,
        //             // contentType: String,
        //             type: String,
        //             required: true,
        //         },
        //         sound: {
        //             type: Object,
        //             required: true,
        //         }
        //     },
        // ],
        // images: [
        //     {
        //         height: {
        //             type: Number,
        //             required: true,
        //         },
        //         imageurl: {
        //             type: String,
        //             required: true,
        //         },
        //         width: {
        //             type: Number,
        //             required: true,
        //         },
        //     },
        // ],
        image: {
            type: [mongoose.Schema.Types.Mixed]
        }
        ,
        text: {
            type: String,
        },
        date: {
            type: Date,
        },
        priority: {
            type: String
        }


    },
    { timestamps: true }
)

export default mongoose.model("tasks", taskSchema);
