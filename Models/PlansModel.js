import mongoose from "mongoose";

const PlanSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        is_Paid: Boolean,
        monthly_price: {
            type: String
        },
        yearly_price: {
            type: String
        },
        services: [String]
    },
    { timestamps: true }
);

export default mongoose.model("Plans", PlanSchema);