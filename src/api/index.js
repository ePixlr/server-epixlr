const express = require("express");
const AuthRoute = require("./Auth/auth.routes");
const OrdersRoute = require("./Order/order.routes");
const TemplateRoute = require("./Template/template.routes");
const SubscriptionRoute = require("./Subscription/subscription.routes");
const UserProfileRoute = require("./UserProfile/userProfile.routes")
const AdminRoute = require("./Admin/admin.routes")

const restRouter = express.Router();
restRouter.use("/auth", AuthRoute);
restRouter.use("/order", OrdersRoute);
restRouter.use("/template", TemplateRoute);
restRouter.use("/subscriptions", SubscriptionRoute);
restRouter.use("/user/profile", UserProfileRoute)
restRouter.use("/admin",AdminRoute);
restRouter.get("/go", (req, res) => {
  res.send({ message: "API Runs Correctly." });
});

module.exports = restRouter;
