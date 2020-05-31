const { userSchema, templateSchema } = require("./schema");

const validateUser = (data) => {
  const { error } = userSchema.validate(data);
  if (error) {
    return { error: error.details[0].message, status: false };
  } else {
    return { error: null, status: true };
  }
};

const validateTemplate = (data) => {
  const { error } = templateSchema.validate(data);
  if (error) {
    return { error: error.details[0].message, status: false };
  } else {
    return { error: null, status: true };
  }
};

module.exports = { validateUser, validateTemplate };
