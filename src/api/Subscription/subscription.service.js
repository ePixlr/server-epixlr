const UserSubscription = require("./userSubscription.model");
const SubscriptionPlan = require("./subscriptionPlan.model");
const HttpStatus = require("http-status-codes");
const moment = require("moment");

const currentTime = moment.utc().format("HH:mm:ss");
const currentDate = moment.utc().format("YYYY-MM-DD");

getAllSubscriptionPlans = async function (req, res) {
    const plans = await SubscriptionPlan.find()
    res.status(HttpStatus.OK).send(plans);
}


getSubscriptionPlan = async function (req, res) {
    const plans = await SubscriptionPlan.findOne({
        planId: req.query.id
    })
    res.status(HttpStatus.OK).send(plans);
}

addUserSubscription = async function (req, res) {
    const { userId: user } = req.headers.user;
    const userSubscription = await UserSubscription.findOne({
        user
    });
    if (userSubscription !== null) {
        updateUserSubscription(req, res, userSubscription);
    } else {
        addNewUserSubscription(req, res, user);
    }
};


updateUserSubscription = async function (req, res, userSubscription) {
    userSubscription.updatedAt = new Date();
    userSubscription.billingToken = req.body.billingToken 
    userSubscription.facilitatorAccessToken =req.body.facilitatorAccessToken
    userSubscription.orderID = req.body.orderID
    userSubscription.subscriptionID = req.body.subscriptionID
    userSubscription.frequency = req.body.frequency
    userSubscription.planId = req.body.planId
    await userSubscription
        .save()
        .then(async (response) => {
            const { _id } = response;
            res.status(HttpStatus.OK).send();
        })
        .catch((error) => {
            throw new Error(error);
        });
};

addNewUserSubscription = async function (req, res, user) {
    const userSubscription = new UserSubscription({
        user,
        billingToken: req.body.billingToken, 
        facilitatorAccessToken: req.body.facilitatorAccessToken, 
        orderID: req.body.orderID, 
        subscriptionID : req.body.subscriptionID,
        frequency: req.body.frequency,
        planId: req.body.planId,
        createdDate: currentDate,
        createdTime: currentTime,
    });
    await userSubscription
        .save()
        .then(async (response) => {
        const { _id } = response;
            res.status(HttpStatus.OK).send({userSubscriptionId: _id});
        })
        .catch((error) => {
            throw new Error(error);
        });
};

getUserSubscription = async function (req, res) {
    const { userId: user } = req.headers.user;

    var userSubscription = await UserSubscription.findOne({
        user
    });

    if(userSubscription){
        userSubscription = userSubscription.toObject()
        userSubscription.plan = await SubscriptionPlan.findOne({ planId: userSubscription.planId })
        res.status(HttpStatus.OK).send(userSubscription);
    }
    else{
        res.status(HttpStatus.NOT_FOUND).send("This user has not subscribed to any plans.")
    }
}

module.exports = { addUserSubscription, getUserSubscription, getAllSubscriptionPlans, getSubscriptionPlan };
