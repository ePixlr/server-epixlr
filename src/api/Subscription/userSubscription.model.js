var mongoose = require("mongoose");
const moment = require("moment");
const currentTime = moment.utc().format("HH:mm:ss");
const currentDate = moment.utc().format("YYYY-MM-DD");

const UserSubscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    frequency: {
        type: String,
    },
    planId: {
        type: String,
    },
    billingToken: {
        type: String,
    }, 
    facilitatorAccessToken: {
        type: String,
    }, 
    orderID: {
        type: String,
    }, 
    subscriptionID: {
        type: String,
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

module.exports = mongoose.model("UserSubscription", UserSubscriptionSchema);
