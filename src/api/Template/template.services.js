const Template = require("./template.model");
const Order = require("../../api/Order/order.model");
let HttpStatus = require("http-status-codes");
const { validateTemplate } = require("../../utils/validation/validate");

createTemplate = async function (req, res) {
  let { data } = req.body || {};
  const { userId: user } = req.headers.user;

  if (!data) {
    data = {};
  }

  const { error, status: valid } = validateTemplate(data);

  if (!valid) {
    return res.status(400).send({
      error,
    });
  }
  const template = new Template({ ...data, user });
  try {
    await template.save().then(async (response) => {
      if (response) {
        const order = await Order.findById(data.order);
        order.status = "PENDING";
        await order.save();
        res.status(200).send({ response });
      }
    });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

getTemplates = async function (req, res) {
  const { userId: user } = req.headers.user;
  if (!user) {
    return res.status(HttpStatus.UNAUTHORIZED).send({
      error: "Invalid User",
    });
  }
  await Template.find({ user })
    .select(
      "name generalOptions.fileSize.size basicOptions.backgroundColor generalOptions.fileType advancedOptions.shadowAndReflections advancedOptions.mannequinAndNeck"
    )
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      throw new Error(error);
    });
};

module.exports = { createTemplate, getTemplates };
