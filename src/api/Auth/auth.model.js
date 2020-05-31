var mongoose = require('mongoose')

const statusEnum = {
    ACTIVE: 'active',
    DEACTIVE: 'deactive'
}

const UsersSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, "UserName is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    status: {
        type: statusEnum
    },
    createdAt: {
        type: Date
    },
    updatedAt: {
        type: Date
    }
}, { versionKey: false })

module.exports = mongoose.model('User', UsersSchema);