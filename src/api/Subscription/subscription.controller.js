const SubscriptionService = require("./subscription.service");

addUserSubscription = async function (req, res) {
    await SubscriptionService.addUserSubscription(req, res);
};

getUserSubscription = async function (req, res) {
    await SubscriptionService.getUserSubscription(req, res);
};

getAllSubscriptionPlans = async function (req, res) {
    await SubscriptionService.getAllSubscriptionPlans(req, res);
}

getSubscriptionPlan = async function (req, res) {
    await SubscriptionService.getSubscriptionPlan(req, res);
}

module.exports = { addUserSubscription, getUserSubscription, getAllSubscriptionPlans, getSubscriptionPlan };
