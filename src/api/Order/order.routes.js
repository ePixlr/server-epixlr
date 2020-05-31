var express = require('express');
var router = express.Router();
const Multer = require("multer");

var OrderController = require('./order.controller')

router.post('/', Multer({ storage: Multer.memoryStorage() }).array("imagesBuffer"), OrderController.createOrder);

module.exports = router;