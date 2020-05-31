var mongoose = require('mongoose')

const imagesStoreSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    url: {
        type: Array,
        required: true
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

module.exports = mongoose.model('ImagesStore', imagesStoreSchema);