import userModel from '../Models/userModel.js';

export const getUsersController = async (req, res) => {
    try {
        const Users = await userModel.find().exec();
        res.status(200).send(Users)
    } catch (error) {
        console.log(error);
        res.status(500).send({
            sucess: false,
            message: "Error in getting users",
            error,
        });
    }
}