const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let user = new Schema(
  {
    user_name: {
      type: String,
      unique: true,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "users" }
);

module.exports = mongoose.model("users", user);
