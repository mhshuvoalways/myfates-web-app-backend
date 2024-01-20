const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    profile: {
      firstName: String,
      lastName: String,
      gender: String,
      birthDate: String,
      birthTime: String,
      language: {
        type: String,
        default: "en",
      },
    },
    roles: {
      type: String,
      default: "user",
    },
    subscriptionPlan: {
      planType: String,
      expireDate: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("user", userSchema);
