var express = require("express");
var router = express.Router();
var AuthController = require("./auth.controller");
var auth = require("../../middlewares/auth");

router.post("/signin", AuthController.signin);
router.post("/", AuthController.signup);
router.get("/verify/:token", AuthController.verify);
router.post("/verification/resend", AuthController.resendVerificationEmail);
router.put("/password", auth, AuthController.changePassword)
router.post("/password", AuthController.createPassword)

module.exports = router;
