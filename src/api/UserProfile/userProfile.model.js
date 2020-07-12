var mongoose = require("mongoose");
const moment = require("moment");
const currentTime = moment.utc().format("HH:mm:ss");
const currentDate = moment.utc().format("YYYY-MM-DD");

const UserProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
        type: String
    },
    email: {
        type: String
    },
    avatar: {
        type: String
    },
    company: {
        type: String
    },
    billingAddress1: {
        type: String
    },
    billingAddress2: {
        type: String
    },
    billingCity: {
        type: String
    },
    billingState: {
        type: String
    },
    billingCountry: {
        type: String
    },
    billingZip: {
        type: String
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

module.exports = mongoose.model("UserProfile", UserProfileSchema);
