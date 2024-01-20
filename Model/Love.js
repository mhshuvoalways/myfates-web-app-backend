const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const reportSchema = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    loveReportWritings: Array,
    loveReport: Object,
  },
  {
    timestamps: true,
  }
);

module.exports = model("love", reportSchema);
