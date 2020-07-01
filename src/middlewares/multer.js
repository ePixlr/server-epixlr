const multer = require("multer");
var fs = require("fs");
var mkdirp = require("mkdirp");
var moment = require("moment");
var currentDate = moment(new Date()).format("YYYY-MM-DD");

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { userId, userName } = req.headers.user;
    const dir = `./public/${userName}-${userId}/${currentDate}`;
    fs.exists(dir, (exist) => {
      if (!exist) {
        mkdirp(dir);
      }
    });
    setTimeout(() => {
      return cb(null, dir);
    }, 3000);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

upload = multer({
  storage,
});

module.exports = { upload };
