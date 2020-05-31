var express = require("express");
var router = express.Router();

var TemplateController = require("./template.controller");

router.post("/", TemplateController.createTemplate);

module.exports = router;
