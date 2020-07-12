var express = require("express");
var router = express.Router();
var AuthController = require("./auth.controller");

router.post("/signin", AuthController.signin);
router.post("/", AuthController.signup);
router.get("/verify/:token", AuthController.verify);

module.exports = router;
