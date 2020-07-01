const express = require("express");
const AuthRoute = require("./Auth/auth.routes");
const OrdersRoute = require("./Order/order.routes");
const TemplateRoute = require("./Template/template.routes");

const restRouter = express.Router();
restRouter.use("/auth", AuthRoute);
restRouter.use("/order", OrdersRoute);
restRouter.use("/template", TemplateRoute);
restRouter.get("/go", (req, res) => {
  res.send({ message: "API Runs Correctly." });
});

module.exports = restRouter;
