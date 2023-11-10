import { comparePassword } from '../Helper/authHelper.js';
import PlansModel from '../Models/PlansModel.js';
import JWT from "jsonwebtoken";

export const create = async (req, res) => {
    try {
        const { title, description, monthly_price, yearly_price, services } = req.body;
        // console.log(title, "body")
        let ispaid; // Declare the ispaid variable here
        const existingPlans = await PlansModel.find();
        if (existingPlans.length >= 3) {
            res.status(201).send({
                success: false,
                message: "Plans cannot be more than 3"
            })
        } else {
            if (!title) {
                return res.status(401).send({ status: false, message: "title cannot be empty" });
            }
            if (monthly_price == 0 || yearly_price == 0) {
                ispaid = false;
            } else {
                ispaid = true;
            }
            const plan = await new PlansModel({
                title,
                description,
                is_Paid: ispaid,
                monthly_price,
                yearly_price,
                services,
            }).save();
            res.status(201).send({
                success: true,
                message: "Plan Successfully created",
                plan: {
                    _id: plan._id,
                    title: plan.title,
                    description: plan.description,
                    is_Paid: plan.is_Paid,
                    monthly_price: plan.monthly_price,
                    yearly_price: plan.yearly_price,
                    services: plan.services,
                }
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in creating Plan",
            error,
        });
    }
}
export const getplans = async (req, res) => {
    try {
        const plans = await PlansModel.find();
        res.status(200).send(plans)
    } catch (error) {
        console.log(error);
        res.status(500).send({
            sucess: false,
            message: "Error in getting Plans",
            error,
        });
    }
}
export const update = async (req, res) => {
    try {
        const { planId } = req.params;
        const { title, description, monthly_price, yearly_price, services } = req.body;
        const existingPlan = await PlansModel.findById(planId);
        if (!existingPlan) {
            return res.status(404).json({
                success: false,
                message: "Plan not found",
            });
        }
        let ispaid;
        if (monthly_price == 0 || yearly_price == 0) {
            ispaid = false;
        } else {
            ispaid = true;
        }
        const updatedPlan = await PlansModel.findByIdAndUpdate(
            planId,
            {
                title: title || existingPlan.title,
                description: description || existingPlan.description,
                monthly_price: monthly_price || existingPlan.monthly_price,
                yearly_price: yearly_price || existingPlan.yearly_price,
                services: services || existingPlan.services,
            },
            { new: true }
        );
        res.status(200).json({
            success: true,
            message: "Plan successfully updated",
            plan: updatedPlan,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating Plan",
            error,
        });
    }
}
export const remove = async (req, res) => {
    try {
        const { planId } = req.params;
        const plans = await PlansModel.find();
        if (plans.length < 3) {
            const deletedPlan = await PlansModel.findByIdAndDelete(planId);

            if (!deletedPlan) {
                return res.status(404).json({
                    success: false,
                    message: "Plan not found",
                });
            } else {
                res.status(200).send({
                    success: true,
                    message: "Plan Deleted Successfully.!"
                });
            }
        } else {
            res.status(400).json({
                success: false,
                message: "Cannot delete plan, there should be at least 3 plans available.",
            });
        }
        // const deletedTasks = await taskModel.deleteMany({ category: deletedTab.label });
        // res.status(200).json({
        //     success: true,
        //     message: "Tab and associated tasks successfully deleted",
        //     tab: deletedTab,
        //     deletedTasks: deletedTasks.deletedCount,
        // });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error in deleting Plan",
            error,
        });
    }
}