var mongoose = require("mongoose");
const moment = require("moment");
const currentTime = moment.utc().format("HH:mm:ss");
const currentDate = moment.utc().format("YYYY-MM-DD");

const imagesStoreSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    url: {
      type: Array,
      required: true,
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

module.exports = mongoose.model("ImagesStore", imagesStoreSchema);
