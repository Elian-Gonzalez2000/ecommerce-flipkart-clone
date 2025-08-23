const mongoose = require("mongoose");
const bannersHomepageSchema = new mongoose.Schema(
  {
    banners: [
      {
        img: { type: String },
        navigateTo: { type: String },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("BannerHomepage", bannersHomepageSchema);
