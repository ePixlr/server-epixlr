var mongoose = require("mongoose");
const moment = require("moment");

const SubscriptionPlanSchema = new mongoose.Schema(
  {
    frequency: {
        type: String,
    },
    planId: {
        type: String,
    },
    planPrice: {
        type: Number,
    }, 
    planName: {
        type: String,
    }, 
    noOfUsers: {
        type: Number,
    }, 
    pricePerImage: {
        type: Number,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("SubscriptionPlan", SubscriptionPlanSchema);
