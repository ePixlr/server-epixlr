var mongoose = require('mongoose')

const OrdersSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    status: {
        type: String,
        enum: ['PENDING', 'CANCELED', 'COMPLETED']
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    updatedAt: {
        type: Date,
        default: new Date()
    }
}, { versionKey: false })

module.exports = mongoose.model('Order', OrdersSchema);