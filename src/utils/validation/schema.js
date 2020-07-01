const Joi = require("@hapi/joi");

const userSchema = Joi.object({
  userName: Joi.string().required(),
  email: Joi.string().required().email(),
  password: Joi.string().required().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});

const templateSchema = Joi.object({
  name: Joi.string().required().label("Template Name"),
  generalOptions: {
    instructions: Joi.string().allow("").optional(),
    fileType: Joi.string().required().label("File Type"),
    fileSize: {
      shape: Joi.string().required().label("File Size"),
      width: Joi.string().allow("").optional(),
      height: Joi.string().allow("").optional(),
      size: Joi.string().allow("").optional(),
    },
  },
  basicOptions: {
    backgroundColor: Joi.string().required().label("Background Color"),
  },
  advancedOptions: {
    shadowAndReflections: Joi.string().allow("").optional(),
    clippingPath: Joi.string().allow("").optional(),
    mannequinAndNeck: Joi.string().allow("").optional(),
  },
  order: Joi.string().required(),
});

module.exports = { userSchema, templateSchema };
