const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const reportSchema = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    title: String,
    date: String,
    reports: Object,
  },
  {
    timestamps: true,
  }
);

module.exports = model("report", reportSchema);
