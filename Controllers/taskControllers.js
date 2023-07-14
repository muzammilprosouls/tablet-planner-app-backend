import taskModel from "../Models/taskModel.js";
import userModel from "../Models/userModel.js";
import notesModel from "../Models/notesModel.js";
// import fs from 'fs';
// import multer from "multer";

export const createTasksController = async (req, res) => {
    try {
        const { title, category, text, paths, recordings, image } = req.body;
        // console.log(recordings)
        const userId = req.user._id;
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
        console.log(image)
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