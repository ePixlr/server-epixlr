const Template = require("./template.model");
const { validateTemplate } = require("../../utils/validation/validate");

createTemplate = async function (req, res) {
  const { data } = req.body || {};

  if (!data) {
    data = {};
  }

  const { error, status: valid } = validateTemplate(data);

  if (!valid) {
    return res.send({
      error,
    });
  }
  const template = new Template({ ...data });
  try {
    await template.save().then((response) => {
      if (response) {
        res.status(200).send({});
      }
    });
  } catch (error) {
    res.send({ error: error.message });
  }
};

module.exports = { createTemplate };
