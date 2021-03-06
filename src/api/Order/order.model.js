var mongoose = require("mongoose");
const moment = require("moment");
const currentTime = moment.utc().format("HH:mm:ss");
const currentDate = moment.utc().format("YYYY-MM-DD");

const OrdersSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["PENDING", "CANCELED", "COMPLETED"],
    },
    createdDate: {
      type: String,
      default: currentDate,
    },
    createdTime: {
      type: String,
      default: currentTime,
    },
    updatedAt: {
      type: Date,
      default: new Date(),
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("Order", OrdersSchema);
