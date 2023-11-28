import mongoose from "mongoose";
// const docSchema = new mongoose.Schema({
//     mimeType: String,
//     name: String,
//     size: Number,
//     type: String,
//     uri: String,
// });
// const recordingSchema = new mongoose.Schema({
//     duration: String,
//     file: String,
//     sound: {
//         type: mongoose.Schema.Types.Mixed // Accepts any nested objects or arrays
//     }
// });

const taskSchema = new mongoose.Schema(
    {
        person: {
            type: mongoose.ObjectId,
            ref: "users",
        },
        isActive: {
            type: Boolean,
            default: true,
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
        // recordings: {
        //     type: [mongoose.Schema.Types.Mixed]
        // },

        recordings: [{
            uri: String,
            duration: String,
            // type:String,
        }],
        // recordings: [{
        //     uri: String,
        //     duration: String
        // }],

        // recordings: [recordingSchema],


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
        },
        text: {
            type: String,
        },
        date: {
            type: Date,
        },
        priority: {
            type: String
        },
        doc: {
            type: [mongoose.Schema.Types.Mixed]
        },
    },
    { timestamps: true }
)

export default mongoose.model("tasks", taskSchema);


// import multer from "multer";

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, "./assets"); // Destination folder for recordings
//     },
//     filename: function (req, file, cb) {
//         const fileName = Date.now() + '-' + file.originalname; // Unique filename for each recording
//         req.recordings = req.recordings || [];
//         req.recordings.push(fileName); // Store filenames (URIs) in the request object
//         cb(null, fileName);
//     },
// });

// const upload = multer({ storage: storage }).array('recordings', 5);

// export const createTasksController = async (req, res) => {
//     try {

//         upload(req, res, async function (err) {
//             if (err instanceof multer.MulterError) {
//                 // A multer error occurred
//                 return res.status(500).json({
//                     success: false,
//                     message: 'Error uploading file',
//                     error: err
//                 });
//             } else if (err) {
//                 // An unknown error occurred
//                 return res.status(500).json({
//                     success: false,
//                     message: 'Unknown error uploading file',
//                     error: err
//                 });
//             }

//             let { title, category, text, paths, image, SelectedDate, priority, doc } = req.body;
//             const userId = req.user._id;
//             const recordings = req.recordings || [];
//             console.log(recordings, "recordings")
//             if (!title) {
//                 // return res.status(401).send({
//                 //     message: "Title is required",
//                 // });
//                 const lastUntitledTask = await taskModel.findOne({ title: /^Untitled\d*$/ })
//                     .sort({ title: -1 })
//                     .exec();

//                 let newTitle;
//                 if (lastUntitledTask) {
//                     const lastNumber = parseInt(lastUntitledTask.title.replace('Untitled', ''), 10);
//                     newTitle = `Untitled${lastNumber + 1}`;
//                 } else {
//                     newTitle = `Untitled1`;
//                 }

//                 // Set the new title
//                 title = newTitle;

//             }
//             const existingUser = await userModel.findById(userId);
//             if (!existingUser) {
//                 return res.status(404).send({
//                     success: false,
//                     message: "User not found",
//                 });
//             }
//             console.log(doc)
//             const task = await new taskModel({
//                 person: userId,
//                 title,
//                 category,
//                 text,
//                 paths,
//                 recordings,
//                 image,
//                 doc,
//                 date: SelectedDate,
//                 priority
//             }).save();
//             res.status(201).send({
//                 success: true,
//                 message: "Task Successfully Saved",
//                 task: {
//                     _id: task._id,
//                     title: task.title,
//                     category: task.category,
//                     paths: task.paths,
//                     recordings: task.recordings,
//                     image: task.image,
//                     date: task.date,
//                     priority: task.priority,
//                     doc: task.doc,
//                     person: {
//                         _id: existingUser._id,
//                         name: existingUser.name,
//                     },
//                 }
//             });
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(500).send({
//             success: false,
//             message: "Error in creating Tasks",
//             error,
//         });
//     }
// }


