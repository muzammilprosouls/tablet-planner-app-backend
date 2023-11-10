import userModel from '../Models/userModel.js';
import { comparePassword, hashPassword } from "../Helper/authHelper.js";
import JWT from "jsonwebtoken";
import tabsModel from '../Models/tabsModel.js';
import PlansModel from '../Models/PlansModel.js';

export const registerController = async (req, res) => {
    try {
        const { name, email, password, selectedPlan } = req.body;
        // console.log(selectedPlan, "upper plan")
        let planId = selectedPlan._id;
        //validations
        if (!name) {
            return res.send({ error: "Name is Required" });
        }
        if (!email) {
            return res.send({ message: "Email is Required" });
        }
        if (!password) {
            return res.send({ message: "Password is Required" });
        }
        if (!selectedPlan) {
            return res.send({ message: "plan is required to continue" });
        }

        //check user
        const exisitingUser = await userModel.findOne({ email });

        //exisiting user
        if (exisitingUser) {
            console.log(exisitingUser, "exisitingUser")
            return res.status(200).send({
                success: false,
                message: "Already Register please login",
            });
        }
        const exisitingPlan = await PlansModel.findById(planId);

        if (!exisitingPlan) {
            return res.status(202).send({
                success: false,
                message: "Plan Doesn't exists",
            })
        }
        console.log(exisitingPlan, "plannnn")
        const hashedPassword = await hashPassword(password);
        // save
        const user = await new userModel({
            name,
            email,
            password: hashedPassword,
            plan: exisitingPlan._id
        }).save();

        const predefinedTabs = [
            {
                label: "CAR-MILAGE",
                color: "#E0E0CE",
                is_active: false,
                is_system_generated: true,
                Imagebackground: "https://tabletplanner.prosoulsinc.com/assets/CAR-MILAGE.jpg",
                logs: false
            },
            {
                label: "ACTIVITY LOG",
                color: "#5A5A10",
                is_active: false,
                is_system_generated: true,
                Imagebackground: "https://tabletplanner.prosoulsinc.com/assets/Activity-Log.jpg",
                logs: false
            },
            {
                label: "CHECK REGISTER",
                color: "#B86FD6",
                is_active: false,
                is_system_generated: true,
                Imagebackground: "https://tabletplanner.prosoulsinc.com/assets/Note1.jpg",
                logs: false
            },

            {
                label: "EQUIPMENT MAINTENANCE LOG",
                color: "#1E64A6",
                is_active: false,
                is_system_generated: true,
                Imagebackground: "https://tabletplanner.prosoulsinc.com/assets/Note1.jpg",
                logs: false
            },

            {
                label: "EXERCISE LOG",
                color: "#6A8CB0",
                is_active: false,
                is_system_generated: true,
                Imagebackground: "https://tabletplanner.prosoulsinc.com/assets/Exercise-log.jpg",
                logs: false
            },

            {
                label: "GROCERY LIST",
                color: "#63DBD9",
                is_active: false,
                is_system_generated: true,
                Imagebackground: "https://tabletplanner.prosoulsinc.com/assets/Note1.jpg",
                logs: false
            },

            {
                label: "MEDICAL INFORMATION",
                color: "#AD343E",
                is_active: false,
                is_system_generated: true,
                Imagebackground: "https://tabletplanner.prosoulsinc.com/assets/medical-information.jpg",
                logs: false
            },

            {
                label: "MEDICAL RECORD",
                color: "#474747",
                is_active: false,
                is_system_generated: true,
                Imagebackground: "https://tabletplanner.prosoulsinc.com/assets/MEDICAL-EXAMINATION.jpg",
                logs: false
            },

            {
                label: "MEETING PLANNER",
                color: "#F2AF29",
                is_active: false,
                is_system_generated: true,
                Imagebackground: "https://tabletplanner.prosoulsinc.com/assets/meeting.jpg",
                logs: false
            },
            {
                label: "MEETING PREP",
                color: "#b94b8a",
                is_active: false,
                is_system_generated: true,
                Imagebackground: "https://tabletplanner.prosoulsinc.com/assets/MEDICAL-EXAMINATION.jpg",
                logs: false
            },

            {
                label: "MONTHLY BUDGET WORKSHEET",
                color: "#1E64A6",
                is_active: false,
                is_system_generated: true,
                Imagebackground: "https://tabletplanner.prosoulsinc.com/assets/monthly-budget-worksheet.jpg",
                logs: false
            },

            {
                label: "MONTHLY BUDGET WORKSHEET 2",
                color: "#5A5A10",
                is_active: false,
                is_system_generated: true,
                Imagebackground: "https://tabletplanner.prosoulsinc.com/assets/monthly-budget-worksheet.jpg",
                logs: false
            },

            {
                label: "MONTHLY EXPENSE TRACKER",
                color: "#00BA70",
                is_active: false,
                is_system_generated: true,
                Imagebackground: "https://tabletplanner.prosoulsinc.com/assets/planner-forms-01.jpg",
                logs: false
            },

            {
                label: "PERSONAL INFORMATION",
                color: "#90124F",
                is_active: false,
                is_system_generated: true,
                Imagebackground: "https://tabletplanner.prosoulsinc.com/assets/personal-information.jpg",
                logs: false
            },

            {
                label: "PERSONAL PROPERTY RECORD",
                color: "#6A8CB0",
                is_active: false,
                is_system_generated: true,
                Imagebackground: "https://tabletplanner.prosoulsinc.com/assets/planner-forms-04.jpg",
                logs: false
            },

            {
                label: "TRAVEL ITINERARY",
                color: "#B86FD6",
                is_active: false,
                is_system_generated: true,
                Imagebackground: "https://tabletplanner.prosoulsinc.com/assets/planner-forms-05.jpg",
                logs: false
            },
            {
                label: "TRAVEL ITINERARY 2",
                color: "#DAB554",
                is_active: false,
                is_system_generated: true,
                Imagebackground: "https://tabletplanner.prosoulsinc.com/assets/planner-forms-05.jpg",
                logs: false
            }
        ];

        for (const tabData of predefinedTabs) {
            const tab = await new tabsModel({
                ...tabData,
                person: user._id
            }).save();
            console.log(tab);
        }
        // }
        // Respond with registration success
        res.status(201).send({
            success: true,
            message: "User Register Successfully",
            user,
            // plan,
            predefinedTabs
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Errro in Registeration",
            error,
        });
    }
};

//POST LOGIN
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        //validation
        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: "Invalid email or password",
            });
        }
        //check user
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Email is not registerd",
            });
        }
        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(200).send({
                success: false,
                message: "Invalid Password",
            });
        }
        //token
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "30d",
        });
        res.status(200).send({
            success: true,
            message: "login successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                // plan: user.plan
            },
            plan: user.plan,
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in login",
            error,
        });
    }
};

//test controller
export const testController = (req, res) => {
    try {
        res.send("Protected Routes");
    } catch (error) {
        console.log(error);
        res.send({ error });
    }
};

//forgot password controller

export const forgotPasswordController = async (req, res) => {
    try {
        const { email, newpassword } = req.body;
        if (!email) {
            res.status(400).send({
                message: "Email is required",
            });
        }
        if (!newpassword) {
            res.status(400).send({
                message: "new Password is required",
            });
        }
        //check
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Wrong Email",
            });
        }
        const hashed = await hashPassword(newpassword);
        await userModel.findByIdAndUpdate(user._id, { password: hashed });
        res.status(200).send({
            success: true,
            message: "Password Reset Successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Something went wrong",
            error,
        });
    }
};

export const updateProfileController = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const user = await userModel.findById(req.user._id);
        if (password && password.length < 6) {
            return res.status(400).send({
                success: false,
                message: "password is short less than 6 characters",
            });
        }
        const hashedPassword = password ? await hashPassword(password) : undefined;
        const updatedUser = await userModel.findByIdAndUpdate(
            req.user._id,
            {
                name: name || user.name,
                password: hashedPassword || user.password
            },
            { new: true }
        );
        res.status(200).send({
            success: true,
            message: "Profile Updated Successfully",
            updatedUser,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            sucess: false,
            message: "Error in updating Profile",
            error,
        });
    }
};

// export const getUsersController = async (req, res) => {
//     try {
//         const Users = await userModel.find().exec();
//         res.status(200).send(Users)
//     } catch (error) {
//         console.log(error);
//         res.status(500).send({
//             sucess: false,
//             message: "Error in getting users",
//             error,
//         });
//     }
// }