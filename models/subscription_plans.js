const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let subscriptionPlan = new Schema(
    {
        plan_id: {
            type: String
        },
        validity: {
            type: String
        },
        cost: {
            type: Number
        },
        created_at: {
            type: Date,
            default: Date.now
        }
    },
    { collection: "subscriptionPlans" }
);

module.exports = mongoose.model("subscriptionPlans", subscriptionPlan);