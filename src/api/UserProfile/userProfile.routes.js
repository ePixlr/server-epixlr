var express = require("express");
var router = express.Router();
var auth = require("../../middlewares/auth");
const multer = require("multer");

var UserProfileController = require("./userProfile.controller");

router.get(
    "/",
    auth,
    UserProfileController.getMyProfile
);

router.post(
    "/",
    auth,
    UserProfileController.addUserProfile
);

router.post(
    "/avatar",
    auth,
    multer({storage: multer.memoryStorage()}).single("file"),
    UserProfileController.addUserProfileAvatar
);

module.exports = router;
