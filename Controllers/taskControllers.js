import taskModel from "../Models/taskModel.js";
import userModel from "../Models/userModel.js";
import notesModel from "../Models/tabsModel.js";
// import fs from 'fs';
// import multer from "multer";

export const createTasksController = async (req, res) => {
    try {
        const { title, category, text, paths, recordings, image, SelectedDate, priority, doc } = req.body;
        const userId = req.user._id;
        console.log(recordings, "recordings")
        if (!title) {
            return res.status(401).send({
                message: "Title is required",
            });
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