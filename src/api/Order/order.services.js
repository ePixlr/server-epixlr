const Order = require("./order.model");
const ImageStore = require("../Uploads/imageStore.schema");
const HttpStatus = require("http-status-codes");
const { decodeToken } = require("../../utils/decodeToken");
const {
  uploadImages,
  updateUploadImages,
} = require("../Uploads/upload.services");
const moment = require("moment");

const currentDate = moment().format("YYYY-MM-DDT00:00:00.000+00:00");

createOrder = async function (req, res) {
  if (req.headers.authorization === undefined) {
    return res.send({
      message: "Token Required",
    });
  }
  if (req.files === undefined) {
    return res.send({
      message: "Files Required",
    });
  }
  const user = decodeToken(req.headers["authorization"], res);
  if (!user) {
    return res.send({
      status: HttpStatus.UNAUTHORIZED,
      message: "Invalid Token",
    });
  }
  const order = await Order.findOne({
    user,
    status: "CANCELED",
    createdAt: currentDate,
  });
  if (order !== null) {
    console.log("Update Runs");
    updateOrder(req, res, order, user, currentDate);
  } else {
    console.log("New Create Runs");
    createNewOrder(req, res, user);
  }
};

updateOrder = async function (req, res, order, user, createdAt) {
  order.updatedAt = currentDate;
  await order
    .save()
    .then(async (response) => {
      const { _id } = response;
      const isImagesUpload = await uploadImages(
        req,
        res,
        createdAt,
        { user, order: _id },
        "UPDATE"
      );
      if (isImagesUpload) {
        return res.send({
          status: HttpStatus.OK,
          message: "Media Uploads Successfully",
          order,
          url: isImagesUpload,
          error: false,
          order: _id,
        });
      } else {
        return res.send({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: "Media Uploads Failed",
          error: true,
          order: null,
        });
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
    createdAt: currentDate,
  });
  await order
    .save()
    .then(async (response) => {
      const { _id } = response;
      const isImagesUpload = await uploadImages(
        req,
        res,
        currentDate,
        { user, order: _id },
        "NEW"
      );
      if (isImagesUpload) {
        return res.send({
          status: HttpStatus.OK,
          message: "Media Uploads Successfully",
          order,
          url: isImagesUpload,
          error: false,
          order: _id,
        });
      } else {
        return res.send({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: "Media Uploads Failed",
          error: true,
          order: null,
        });
      }
    })
    .catch((error) => {
      throw new Error(error);
    });
};

module.exports = { createOrder };
