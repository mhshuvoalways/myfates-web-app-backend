const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const reportSchema = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    dReportWritings: Array,
    dReport: Object,
  },
  {
    timestamps: true,
  }
);

module.exports = model("dReport", reportSchema);
