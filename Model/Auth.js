const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const authSchema = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    passwordHash: {
      type: String,
    },
    strategy: {
      type: String,
      default: "email",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("auth", authSchema);
