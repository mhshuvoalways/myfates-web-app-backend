const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const reportSchema = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    financeReportWritings: Array,
    financeReport: Object,
  },
  {
    timestamps: true,
  }
);

module.exports = model("finance", reportSchema);
