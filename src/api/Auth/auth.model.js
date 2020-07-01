var mongoose = require("mongoose");
const crypto = require("crypto");
const Token = require("./token.model");

const statusEnum = {
  ACTIVE: "active",
  DEACTIVE: "deactive",
};

const UsersSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "UserName is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    status: {
      type: statusEnum,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
    },
    updatedAt: {
      type: Date,
    },
  },
  { versionKey: false }
);

UsersSchema.methods.generateVerificationToken = (userId) => {
  console.log("datatatatta,", userId);
  let payload = {
    userId,
    token: crypto.randomBytes(20).toString("hex"),
  };
  return new Token(payload);
};

module.exports = mongoose.model("User", UsersSchema);
