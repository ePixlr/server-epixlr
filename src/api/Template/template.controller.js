const TemplateService = require("./template.services");

createTemplate = async function (req, res) {
  await TemplateService.createTemplate(req, res);
};

module.exports = { createTemplate };
