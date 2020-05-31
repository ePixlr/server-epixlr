const minioClient = require("../../config/minio.config");
const ImageStore = require("./imageStore.schema");
const moment = require("moment");
const HttpStatus = require("http-status-codes");
const { decodeToken } = require("../../utils/decodeToken");

const currentDate = moment().format("YYYY-MM-DDT00:00:00.000+00:00");

uploadImages = async function (req, res, createdAt, { user, order }, status) {
  if (!(await bucketExist())) {
    await createBucket();
  }
  const response = await minioClient.putObject(
    process.env.MINIO_BUCKET,
    req.files[0].originalname,
    req.files[0].buffer
  );
  if (response) {
    const url = `${process.env.MINIO_URL}/${req.files[0].originalname}`;
    if (status === "NEW") return insertImages(url, order, user);
    else if (status === "UPDATE")
      return updateImages(url, order, user, createdAt);
  }
};

updateImages = async function (serverImage, order, user, createdAt) {
  console.log("UpdateImages run");

  const storeImages = await ImageStore.findOne({ user, order, createdAt });

  if (storeImages !== null) {
    console.log("StoreImage Found");
    storeImages.url.push(serverImage);
    return await storeImages
      .save()
      .then((response) => {
        if (!response) {
          return false;
        }
        return serverImage;
      })
      .catch(() => {
        return false;
      });
  } else {
    return await insertImages(serverImage, order, user);
  }
};

insertImages = async function (url, order, user) {
  const imagesStore = new ImageStore({
    url,
    user,
    order,
    createdAt: currentDate,
  });
  return await imagesStore
    .save()
    .then((response) => {
      return [url];
    })
    .catch((error) => {
      return false;
    });
};

deleteImageFromMinio = async function (req, res) {
  if (req.headers.authorization === undefined) {
    return res.send({
      message: "Token Required",
    });
  }
  const user = decodeToken(req.headers["authorization"], res);
  if (!user) {
    return res.send({
      status: HttpStatus.UNAUTHORIZED,
      message: "Invalid Token",
    });
  }
  const { imageName, order } = req.body || {};
  if (!imageName || !order) {
    return res.send({
      error: "File Name and specific order Required",
    });
  }
  try {
    await minioClient.removeObject(
      process.env.MINIO_BUCKET,
      imageName,
      function (err) {
        if (err) {
          return res.send({
            error: err,
          });
        }
        deleteFromDB(imageName, user, order, res);
      }
    );
  } catch (error) {
    return res.send({
      error: error.message,
    });
  }
};

deleteFromDB = async function (imageName, user, order, res) {
  const storeImages = await ImageStore.findOne({
    user,
    order,
    createdAt: currentDate,
  });
  if (!storeImages) {
    return res.send({
      error: "No any record found of that order",
    });
  }
  imageName = `${process.env.MINIO_URL}/${imageName}`;
  const index = storeImages.url.findIndex((url) => url === imageName);
  console.log(index);
  index != -1 && storeImages.url.splice(index, 1);
  storeImages
    .save()
    .then((response) => {
      if (response) {
        return res.send({
          error: null,
          message: "Image Deleted Successfull",
        });
      }
      return res.send({
        error: "Image Deleted Failed",
      });
    })
    .catch((error) => {
      return res.send({
        error: error.message,
      });
    });
};

bucketExist = function () {
  const exist = minioClient.bucketExists(process.env.MINIO_BUCKET);
  if (exist) return true;
  return false;
};

createBucket = function () {
  return minioClient.makeBucket(process.env.MINIO_BUCKET, "us-east-1");
};

module.exports = { uploadImages, deleteImage: deleteImageFromMinio };
