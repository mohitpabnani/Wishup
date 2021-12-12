const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let subscription = new Schema(
    {
        user_name: {
            type: String
        },
        plan_id: {
            type: String
        },
        start_date: {
            type: Date
        },
        valid_till: {
            type: Date
        },
        created_at: {
            type: Date,
            default: Date.now
        }
    },
    { collection: "subscriptions" }
);

module.exports = mongoose.model("subscriptions", subscription);