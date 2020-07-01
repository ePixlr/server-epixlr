var jwt = require("jsonwebtoken");
const secret_key = process.env.JWT_SECRET;

const getToken = (userId, userName) => {
  return jwt.sign({ userId, userName }, secret_key, { expiresIn: "1 week" });
};

module.exports = { getToken };
