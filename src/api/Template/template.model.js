var mongoose = require("mongoose");

const GeneralOptionsSchema = {
  instructions: {
    type: String,
  },
  fileType: {
    type: String,
    required: [true, "File Type Required"],
  },
  fileSize: {
    type: String,
    required: [true, "File Size Required"],
  },
};

const BasicOptionsSchema = {
  backgroundColor: {
    type: String,
    required: [true, "Background Color Required"],
  },
};

const AdvancedOptionsSchema = {
  shadowAndReflections: {
    type: String,
  },
  clippingPath: {
    type: String,
  },
  mannequinAndNeck: {
    type: String,
  },
};

const TemplateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Template Name Required"],
    },

    generalOptions: GeneralOptionsSchema,

    basicOptions: BasicOptionsSchema,

    advancedOptions: AdvancedOptionsSchema,

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
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

module.exports = mongoose.model("Template", TemplateSchema);
