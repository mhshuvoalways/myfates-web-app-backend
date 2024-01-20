const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const reportSchema = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    horoscope: String,
  },
  {
    timestamps: true,
  }
);

module.exports = model("horoscope", reportSchema);
