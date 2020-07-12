var HttpStatus = require("http-status-codes");
module.exports = (req, res, next) => {
  try {
    if (req.headers.user.role == "ADMIN") {
      next();
    }
    else{
        res.status(HttpStatus.FORBIDDEN);
        return res.send({
            status: HttpStatus.FORBIDDEN,
            error: "This function can only be performed by admins.",
        });
    }
  } catch (err) {
    res.status(HttpStatus.UNAUTHORIZED);
    return res.send({
      status: HttpStatus.UNAUTHORIZED,
      error: "This function can only be performed by admins.",
    });
  }
};
