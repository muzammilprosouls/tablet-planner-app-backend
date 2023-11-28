import taskModel from "../Models/taskModel.js";
import userModel from "../Models/userModel.js";
import notesModel from "../Models/tabsModel.js";
// import fs from 'fs';
import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./assets"); // Destination folder for recordings
    },
    filename: function (req, file, cb) {
        console.log(req.body, "body in filename"); // Log the entire request body
        console.log(req.files, "files in filename"); // Log the received files (if using multer)
        console.log(req.recordings, "recording.req in filename");
        const fileName = file.originalname; // Unique filename for each recording
        req.recordings = req.recordings || [];
        req.recordings.push(fileName); // Store filenames (URIs) in the request object
        cb(null, fileName);
    },
});

const upload = multer({ storage: storage }).array('recordings', 5);

export const createTasksController = async (req, res) => {
    try {
        console.log(req.body, "body"); // Log the entire request body
        console.log(req.files, "files"); // Log the received files (if using multer)
        console.log(req.recordings, "recording.req");
        upload(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                // A multer error occurred
                return res.status(500).json({
                    success: false,
                    message: 'Error uploading file',
                    error: err
                });
            } else if (err) {
                // An unknown error occurred
                return res.status(500).json({
                    success: false,
                    message: 'Unknown error uploading file',
                    error: err
                });
            }
            let { title, category, text, paths, image, SelectedDate, priority, doc } = req.body;
            const userId = req.user._id;
            const recordings = req.recordings || [];
            // console.log(recordings, "recordings")
            // console.log(paths, "paths")
            if (!title) {
                // return res.status(401).send({
                //     message: "Title is required",
                // });x
                const lastUntitledTask = await taskModel.findOne({ title: /^Untitled\d*$/ })
                    .sort({ title: -1 })
                    .exec();

                let newTitle;
                if (lastUntitledTask) {
                    const lastNumber = parseInt(lastUntitledTask.title.replace('Untitled', ''), 10);
                    newTitle = `Untitled ${category} ${lastNumber + 1}`;
                } else {
                    newTitle = `Untitled1`;
                }

                title = newTitle;

            }
            const existingUser = await userModel.findById(userId);
            if (!existingUser) {
                return res.status(404).send({
                    success: false,
                    message: "User not found",
                });
            }
            console.log(doc)
            // const recordings = [];

            // // Loop through the recording files
            // for (const file of req.files) {
            //     const fileBuffer = fs.readFileSync(file.path);
            //     const base64Data = fileBuffer.toString("base64");

            //     const recording = {
            //         duration: file.originalname,
            //         file: {
            //             data: fileBuffer,
            //             contentType: file.mimetype,
            //         },
            //     };

            //     recordings.push(recording);

            //     // Delete the temporary file
            //     fs.unlinkSync(file.path);
            // }
            // const imageBuffer = fs.readFileSync(req.file.path);
            const task = await new taskModel({
                person: userId,
                title,
                category,
                text,
                paths,
                recordings,
                image,
                doc,
                date: SelectedDate,
                priority
            }).save();
            res.status(201).send({
                success: true,
                message: "Task Successfully Saved",
                task: {
                    _id: task._id,
                    title: task.title,
                    category: task.category,
                    paths: task.paths,
                    recordings: task.recordings,
                    image: task.image,
                    date: task.date,
                    priority: task.priority,
                    doc: task.doc,
                    person: {
                        _id: existingUser._id,
                        name: existingUser.name,
                    },
                }
            });
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in creating Tasks",
            error,
        });
    }
}

export const getTasksController = async (req, res) => {
    const { userId } = req.params;
    try {
        const Tasks = await taskModel.find({ person: userId }).exec();
        res.status(200).send(Tasks);
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in getting Tasks",
            error,
        });
    }
}

export const updateTaskController = async (req, res) => {
    const { taskId } = req.params;
    const { title, text, category, paths, recordings, image, SelectedDate, priority, doc } = req.body;
    try {
        const existingTask = await taskModel.findById(taskId);

        if (!existingTask) {
            return res.status(404).json({
                success: false,
                message: "Activity not found",
            });
        }
        const date = SelectedDate
        const updatedTask = await taskModel.findByIdAndUpdate(
            taskId,
            {
                title: title || existingTask.title,
                text: text || existingTask.text,
                category: category || existingTask.category,
                paths: paths || existingTask.paths,
                recordings: recordings || existingTask.recordings,
                image: image || existingTask.image,
                date: date || existingTask.date,
                priority: priority || existingTask.priority,
                doc: doc || existingTask.doc
            },
            { new: true }
        );
        console.log(updatedTask)
        res.status(200).json({
            success: true,
            message: "Activity successfully updated",
            task: updatedTask,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error updating activity",
            error,
        });
    }
};

export const deleteTaskController = async (req, res) => {
    const { taskId } = req.params;

    try {
        const deletedTask = await taskModel.findByIdAndDelete(taskId);
        if (!deletedTask) {
            return res.status(404).json({
                success: false,
                message: "Activity not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Activity successfully deleted",
            task: deletedTask,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error in deleting activity",
            error,
        });
    }
};


// export const createTasksController = async (req, res) => {
//     try {
//         let { title, category, text, paths, recordings, image, SelectedDate, priority, doc } = req.body;
//         const userId = req.user._id;
//         console.log(recordings, "recordings")
//         if (!title) {
//             // return res.status(401).send({
//             //     message: "Title is required",
//             // });
//             const lastUntitledTask = await taskModel.findOne({ title: /^Untitled\d*$/ })
//                 .sort({ title: -1 })
//                 .exec();

//             let newTitle;
//             if (lastUntitledTask) {
//                 const lastNumber = parseInt(lastUntitledTask.title.replace('Untitled', ''), 10);
//                 newTitle = `Untitled ${category} ${lastNumber + 1}`;
//             } else {
//                 newTitle = `Untitled1`;
//             }

//             // Set the new title
//             title = newTitle;

//         }
//         const existingUser = await userModel.findById(userId);
//         if (!existingUser) {
//             return res.status(404).send({
//                 success: false,
//                 message: "User not found",
//             });
//         }
//         console.log(doc)
//         // const recordings = [];

//         // // Loop through the recording files
//         // for (const file of req.files) {
//         //     const fileBuffer = fs.readFileSync(file.path);
//         //     const base64Data = fileBuffer.toString("base64");

//         //     const recording = {
//         //         duration: file.originalname,
//         //         file: {
//         //             data: fileBuffer,
//         //             contentType: file.mimetype,
//         //         },
//         //     };

//         //     recordings.push(recording);

//         //     // Delete the temporary file
//         //     fs.unlinkSync(file.path);
//         // }
//         // const imageBuffer = fs.readFileSync(req.file.path);
//         const task = await new taskModel({
//             person: userId,
//             title,
//             category,
//             text,
//             paths,
//             recordings,
//             image,
//             doc,
//             date: SelectedDate,
//             priority
//         }).save();
//         res.status(201).send({
//             success: true,
//             message: "Task Successfully Saved",
//             task: {
//                 _id: task._id,
//                 title: task.title,
//                 category: task.category,
//                 paths: task.paths,
//                 recordings: task.recordings,
//                 image: task.image,
//                 date: task.date,
//                 priority: task.priority,
//                 doc: task.doc,
//                 person: {
//                     _id: existingUser._id,
//                     name: existingUser.name,
//                 },
//             }
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