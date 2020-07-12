var express = require("express");
var router = express.Router();
var auth = require("../../middlewares/auth");

var SubscriptionsController = require("./subscription.controller");

router.get(
    "/user",
    auth,
    SubscriptionsController.getUserSubscription
);

router.post(
    "/user",
    auth,
    SubscriptionsController.addUserSubscription
);

router.get(
    "/",
    auth,
    SubscriptionsController.getAllSubscriptionPlans
)

router.get(
    "/:id",
    auth,
    SubscriptionsController.getSubscriptionPlan
)

module.exports = router;
