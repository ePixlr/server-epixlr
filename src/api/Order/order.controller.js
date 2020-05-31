const OrderService = require('./order.services')

createOrder = async function (req, res) {
    await OrderService.createOrder(req, res)
}

module.exports = { createOrder }