const User = require("./auth.model");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
var HttpStatus = require("http-status-codes");
const { getToken } = require("../../utils/generateToken");
const { hashedPassword } = require("../../utils/hashPassword");
const { validateUser } = require("../../utils/validation/validate");

signup = async function (req, res) {
  let { userName, email, password } = req.body || {};
  const { error, status } = validateUser({ userName, email, password });

  if (status === false) {
    return res.send({
      status: HttpStatus.PRECONDITION_REQUIRED,
      error,
    });
  }

  if (await userExist(email)) {
    return res.send({
      status: HttpStatus.CONFLICT,
      error: `Email ${email} already registered try another email`,
    });
  }

  password = await hashedPassword(password);
  const user = new User({
    userName,
    email,
    password,
  });

  await user
    .save()
    .then(async (response) => {
      const { _id, userName } = response;
      res.send({
        status: HttpStatus.OK,
        user: userName,
        token: await getToken(_id),
      });
    })
    .catch((error) => {
      throw new Error(error);
    });
};

signin = async function (req, res) {
  let { email, password } = req.body || {};
  const { error, status } = validateUser({ userName: "null", email, password });

  if (status === false) {
    return res.send({
      status: HttpStatus.PRECONDITION_REQUIRED,
      error,
    });
  }

  await User.findOne({ email })
    .then(async (user) => {
      if (!user) {
        return res.send({
          status: HttpStatus.NON_AUTHORITATIVE_INFORMATION,
          error: "Unable to login",
        });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.send({
          status: HttpStatus.NON_AUTHORITATIVE_INFORMATION,
          error: "Unable to login",
        });
      }

      return res.send({
        status: HttpStatus.OK,
        user: user.userName,
        error: null,
        token: await getToken(user._id),
      });
    })
    .catch((error) => {
      throw new Error(error);
    });
};

userExist = async function (email) {
  const userExist = await User.find({ email });
  if (userExist.length > 0) return true;
  else return false;
};

module.exports = { signin, signup };
