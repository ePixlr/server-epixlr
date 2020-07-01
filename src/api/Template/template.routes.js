let express = require("express");
let router = express.Router();
let auth = require("../../middlewares/auth");

let TemplateController = require("./template.controller");

router.post("/", auth, TemplateController.createTemplate);
router.get("/", auth, TemplateController.getTemplates);

module.exports = router;
