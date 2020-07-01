const TemplateService = require("./template.services");

createTemplate = async function (req, res) {
  await TemplateService.createTemplate(req, res);
};

getTemplates = async function (req, res) {
  await TemplateService.getTemplates(req, res);
};

module.exports = { createTemplate, getTemplates };
