const express = require("express");
const AuthRoute = require("./Auth/auth.routes");
const OrdersRoute = require("./Order/order.routes");
const UploadsRoute = require("./Uploads/upload.routes");
const TemplateRoute = require("./Template/template.routes");

const restRouter = express.Router();
restRouter.use("/auth", AuthRoute);
restRouter.use("/order", OrdersRoute);
restRouter.use("/media", UploadsRoute);
restRouter.use("/template", TemplateRoute);

module.exports = restRouter;
