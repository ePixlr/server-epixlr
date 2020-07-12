const mongoose = require("mongoose");

const TokensSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    token: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["EMAIL_CONFIRMATION", "USER_INVITATION"],
    },

    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
      expires: 43200,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tokens", TokensSchema);
