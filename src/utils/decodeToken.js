const jwt = require('jsonwebtoken');
const HttpStatus = require('http-status-codes');
const secret_key = process.env.JWT_SECRET;

verifyToken = (token) => {
    return jwt.verify(token, secret_key, function (err, success) {
        if (err) {
            return false
        }
        else {
            return true
        }
    })
}

exports.decodeToken = (token, res) => {
    const isTokenValid = verifyToken(token);
    if (isTokenValid) {
        const { userId } = jwt.decode(token);
        return userId;
    } else {
        return null;
    }
}

