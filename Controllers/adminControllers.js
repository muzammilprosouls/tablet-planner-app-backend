import { comparePassword } from '../Helper/authHelper.js';
import userModel from '../Models/userModel.js';
import JWT from "jsonwebtoken";

export const getUsers = async (req, res) => {
    try {
        const Users = await userModel.find({ role: { $ne: true } }).select('-password').exec();
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

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: "Invalid email or password",
            });
        }
        //check user
        const admin = await userModel.findOne({ email });
        if (!admin) {
            return res.status(404).send({
                success: false,
                message: "Email is not registerd",
            });
        }
        if (admin.role === true) {
            const match = await comparePassword(password, admin.password);
            if (!match) {
                return res.status(200).send({
                    success: false,
                    message: "Invalid Password",
                });
            }
            const token = await JWT.sign({ _id: admin._id }, process.env.JWT_SECRET, {
                expiresIn: "30d",
            });
            res.status(200).send({
                success: true,
                message: "login successfully",
                admin: {
                    _id: admin._id,
                    name: admin.name,
                    email: admin.email,
                    role: admin.role
                },
                token,
            });
        } else {
            return res.status(404).send({
                success: false,
                message: "admin not found",
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in login",
            error,
        });
    }
}

export const changeStatus = async (req, res) => {
    try {
        const { UserId } = req.params;
        console.log(UserId, "userId")
        const { is_Active } = req.body;
        console.log(is_Active, "is_Active")
        const existingUser = await userModel.findById(UserId);
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        const updatedUser = await userModel.findByIdAndUpdate(
            UserId,
            { is_Active: is_Active },
            { new: true }
        );
        console.log(updatedUser)
        res.status(200).json({
            success: true,
            message: "User Status Successfully Updated",
            user: updatedUser,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error updating User Status",
            error,
        });
    }
}

export const updateProfile = async (req, res) => {

}