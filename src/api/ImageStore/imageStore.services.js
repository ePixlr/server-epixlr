const ImageStore = require("./imageStore.schema");
const HttpStatus = require("http-status-codes");
const moment = require("moment");
const currentTime = moment.utc().format("HH:mm:ss");
const currentDate = moment.utc().format("YYYY-MM-DD");

storeImages = async function (req, res, { user, order }, role) {
  if (req.files.length > 0) {
    const promise = await Promise.all(
      req.files.map(({ destination, originalname }) => {
        return `${destination}/${originalname}`;
      })
    );
    if (role === "NEW") {
      return await insertImages(promise, order, user);
    } else if (role === "UPDATE") {
      return await updateImages(promise, order, user);
    }
  } else {
    return res.status(400).send({ messgae: "Files/File Required" });
  }
};

updateImages = async function (url, order, user) {
  console.log("UpdateImages run", order, user);

  const storeImages = await ImageStore.findOne({
    user,
    order,
    createdDate: currentDate,
  });

  if (storeImages !== null) {
    console.log("StoreImage Found");
    url.map((path) => {
      storeImages.url.push(path);
    });
    return await storeImages
      .save()
      .then((response) => {
        if (response) {
          return url;
        }
      })
      .catch(() => {
        return null;
      });
  } else {
    return await insertImages(url, order, user);
  }
};

insertImages = async function (url, order, user) {
  const imagesStore = new ImageStore({
    url,
    user,
    order,
    createdDate: currentDate,
    createdTime: currentTime,
  });
  return await imagesStore
    .save()
    .then((response) => {
      if (response) {
        return url;
      }
    })
    .catch((error) => {
      return null;
    });
};

// deleteImageFromMinio = async function (req, res) {
//   if (req.headers.authorization === undefined) {
//     return res.send({
//       message: "Token Required",
//     });
//   }
//   const user = decodeToken(req.headers["authorization"], res);
//   if (!user) {
//     return res.send({
//       status: HttpStatus.UNAUTHORIZED,
//       message: "Invalid Token",
//     });
//   }
//   const { imageName, order } = req.body || {};
//   if (!imageName || !order) {
//     return res.send({
//       error: "File Name and specific order Required",
//     });
//   }
//   try {
//     await minioClient.removeObject(
//       process.env.MINIO_BUCKET,
//       imageName,
//       function (err) {
//         if (err) {
//           return res.send({
//             error: err,
//           });
//         }
//         deleteFromDB(imageName, user, order, res);
//       }
//     );
//   } catch (error) {
//     return res.send({
//       error: error.message,
//     });
//   }
// };

// deleteFromDB = async function (imageName, user, order, res) {
//   const storeImages = await ImageStore.findOne({
//     user,
//     order,
//     createdAt: currentDate,
//   });
//   if (!storeImages) {
//     return res.send({
//       error: "No any record found of that order",
//     });
//   }
//   imageName = `${process.env.MINIO_URL}/${imageName}`;
//   const index = storeImages.url.findIndex((url) => url === imageName);
//   console.log(index);
//   index != -1 && storeImages.url.splice(index, 1);
//   storeImages
//     .save()
//     .then((response) => {
//       if (response) {
//         return res.send({
//           error: null,
//           message: "Image Deleted Successfull",
//         });
//       }
//       return res.send({
//         error: "Image Deleted Failed",
//       });
//     })
//     .catch((error) => {
//       return res.send({
//         error: error.message,
//       });
//     });
// };

// bucketExist = function () {
//   const exist = minioClient.bucketExists(process.env.MINIO_BUCKET);
//   if (exist) return true;
//   return false;
// };

// createBucket = function () {
//   return minioClient.makeBucket(process.env.MINIO_BUCKET, "us-east-1");
// };

module.exports = { storeImages };
