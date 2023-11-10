import mongoose from "mongoose";

const PlanSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: {
            type: String,
        },
        is_Paid: Boolean,
        monthly_price: {
            type: String
        },
        yearly_price: {
            type: String
        },
        services: [
            {
                predefinedTabs: Boolean,
                customTabs: Boolean,
                reminder: Boolean
            }
        ]
    },
    { timestamps: true }
);

export default mongoose.model("Plans", PlanSchema);