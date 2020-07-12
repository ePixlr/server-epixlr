var express = require("express");
var router = express.Router();
var auth = require("../../middlewares/auth");
var admin = require("../../middlewares/admin");
var AdminController = require("./admin.controller");

router.get(
    "/users",
    [auth, admin],
    AdminController.getMyUsers
);

router.post(
    "/invite",
    [auth, admin], 
    AdminController.inviteUser
);

router.get(
    "/user/:userId/profile",
    [auth, admin], 
    AdminController.getUserProfile
);

router.put(
    "/user/:userId/profile",
    [auth, admin], 
    AdminController.updateUserProfile
);


module.exports = router;
