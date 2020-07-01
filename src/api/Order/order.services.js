const Order = require("./order.model");
const HttpStatus = require("http-status-codes");
const { decodeToken } = require("../../utils/decodeToken");
const { storeImages } = require("../ImageStore/imageStore.services");
const moment = require("moment");

const currentTime = moment.utc().format("HH:mm:ss");
const currentDate = moment.utc().format("YYYY-MM-DD");

createOrder = async function (req, res) {
  const { userId: user } = req.headers.user;
  const order = await Order.findOne({
    user,
    status: "CANCELED",
    createdDate: currentDate,
  });
  if (order !== null) {
    console.log("Update Runs");
    updateOrder(req, res, order, user);
  } else {
    console.log("New Create Runs");
    createNewOrder(req, res, user);
  }
};

updateOrder = async function (req, res, order, user) {
  order.updatedAt = new Date();
  await order
    .save()
    .then(async (response) => {
      const { _id } = response;
      const urls = await storeImages(req, res, { user, order: _id }, "UPDATE");
      if (urls) {
        res.status(HttpStatus.OK).send({ order: _id, urls: urls });
      } else {
        return res.status(HttpStatus.BAD_REQUEST);
      }
    })
    .catch((error) => {
      throw new Error(error);
    });
};

createNewOrder = async function (req, res, user) {
  const order = new Order({
    user,
    status: "CANCELED",
    createdDate: currentDate,
    createdTime: currentTime,
  });
  await order
    .save()
    .then(async (response) => {
      const { _id } = response;
      const urls = await storeImages(req, res, { user, order: _id }, "NEW");
      if (urls) {
        res.status(HttpStatus.OK).send({ order: _id, urls: urls });
      } else {
        return res.status(HttpStatus.BAD_REQUEST);
      }
    })
    .catch((error) => {
      throw new Error(error);
    });
};

module.exports = { createOrder };
