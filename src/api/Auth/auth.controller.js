const AuthService = require("./auth.services");

signin = async function (req, res) {
  await AuthService.signin(req, res);
};
signup = async function (req, res) {
  await AuthService.signup(req, res);
};
verify = async function (req, res) {
  await AuthService.verify(req, res);
};

module.exports = { signup, signin, verify };
