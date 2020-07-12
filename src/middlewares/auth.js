const jwt = require("jsonwebtoken");
var HttpStatus = require("http-status-codes");
const secret_key = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
  if (req.headers.authorization === undefined) {
    res.status(HttpStatus.UNAUTHORIZED);
    return res.send({
      status: HttpStatus.UNAUTHORIZED,
      error: "Authentication Token Required",
    });
  }
  try {
    var token = req.headers.authorization;
    token = token.replace("Bearer ","")
    const decodedToken = jwt.verify(token, secret_key);
    const userId = decodedToken.userId;
    const userName = decodedToken.userName;
    const role = decodedToken.role;
    if (userId && userName) {
      req.headers.user = { userId, userName, role };
      next();
    }
  } catch (err) {
    console.log(err)
    res.status(HttpStatus.UNAUTHORIZED);
    return res.send({
      status: HttpStatus.UNAUTHORIZED,
      error: "Invalid / Expire Token",
    });
  }
};
