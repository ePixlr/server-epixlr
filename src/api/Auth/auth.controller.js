const AuthService = require("./auth.service");

signin = async function (req, res) {
  await AuthService.signin(req, res);
};

signup = async function (req, res) {
  await AuthService.signup(req, res);
};

verify = async function (req, res) {
  await AuthService.verify(req, res);
};

resendVerificationEmail = async function (req, res) {
  await AuthService.resendVerificationEmail(req, res);
};

changePassword = async function (req, res) {
  await AuthService.changePassword(req, res);
};

createPassword = async function (req, res) {
  await AuthService.createPassword(req, res);
};

module.exports = { signup, signin, verify, resendVerificationEmail, changePassword, createPassword };
