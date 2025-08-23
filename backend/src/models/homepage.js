const mongoose = require("mongoose");
const homepageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    banners: [
      {
        img: { type: String },
        navigateTo: { type: String },
      },
    ],
    products: [
      {
        img: { type: String },
        navigateTo: { type: String },
        offer: { type: Number || Boolean, default: false },
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      unique: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Homepage", pageSchema);
