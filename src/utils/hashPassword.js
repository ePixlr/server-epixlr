const bcrypt = require('bcryptjs')

const hashedPassword = async (password) => {
    return bcrypt.hash(password, 10)
}

module.exports = { hashedPassword }