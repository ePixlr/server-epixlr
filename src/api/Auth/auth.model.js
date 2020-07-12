var mongoose = require("mongoose");
const crypto = require("crypto");
const Token = require("./token.model");

const statusEnum = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  PENDING: "PENDING"
};

const roleEnum = {
  ADMIN: "ADMIN",
  DESIGNER: "DESIGNER",
  PHOTOGRAPHER: "PHOTOGRAPHER"
}

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
    role: {
        type: roleEnum,
        default: roleEnum.ADMIN
    },
    status: {
      type: statusEnum,
      default: statusEnum.ACTIVE
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: new Date()
    },
    updatedAt: {
      type: Date,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  },
  { versionKey: false }
);

UsersSchema.methods.generateVerificationToken = (userId) => {
  let payload = {
    userId,
    type: 'EMAIL_CONFIRMATION',
    token: crypto.randomBytes(20).toString("hex"),
  };
  return new Token(payload);
};

UsersSchema.methods.generateInvitationToken = (userId) => {
  let payload = {
    userId,
    type:'USER_INVITATION',
    token: crypto.randomBytes(20).toString("hex"),
  };
  return new Token(payload);
};

module.exports = mongoose.model("User", UsersSchema);
