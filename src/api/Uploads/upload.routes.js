var express = require("express");
var router = express.Router();

var UploadServices = require("./upload.services");

router.delete("/", UploadServices.deleteImage);

module.exports = router;
