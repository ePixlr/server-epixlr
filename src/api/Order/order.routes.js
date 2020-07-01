var express = require("express");
var router = express.Router();
var { upload } = require("../../middlewares/multer");
var auth = require("../../middlewares/auth");
var app = express();

var OrderController = require("./order.controller");

router.post(
  "/",
  auth,
  upload.array("imagesBuffer"),
  OrderController.createOrder
);

module.exports = router;
