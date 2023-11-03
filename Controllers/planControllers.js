import { comparePassword } from '../Helper/authHelper.js';
import PlansModel from '../Models/PlansModel.js';
import JWT from "jsonwebtoken";

export const create = async (req, res) => {
    try {
        const { title, monthly_price, yearly_price, services } = req.body;
        if (!title) {
            return res.status(401).send({ status: false, message: "title cannot be empty" });
        }
        if (monthly_price || yearly_price) {
            ispaid = true
        }
        const plan = await new PlansModel({
            title,
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
                is_Paid: plan.is_Paid,
                monthly_price: plan.monthly_price,
                yearly_price: plan.yearly_price,
                services: plan.services,
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in creating Plan",
            error,
        });
    }
}
export const get = async (req, res) => {
    try {

    } catch (error) {

    }
}
export const update = async (req, res) => {
    try {

    } catch (error) {

    }
}
export const remove = async (req, res) => {
    try {

    } catch (error) {

    }
}