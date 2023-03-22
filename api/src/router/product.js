const express = require("express");
const {
   requiresSignin,
   adminMiddleware,
} = require("../common-middleware/index.js");
const Category = require("../models/category");
const {
   createProduct,
   getProductsBySlug,
} = require("../controller/product.js");
const multer = require("multer");
const router = express.Router();
const shortid = require("shortid");
const path = require("path");

const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, path.join(path.dirname(__dirname), "../uploads"));
   },
   filename: function (req, file, cb) {
      cb(null, `${shortid.generate()}-${file.originalname}`);
   },
});
console.log(path.join(path.dirname(__dirname), "uploads"));
const upload = multer({ storage });

router.post(
   "/product/create",
   requiresSignin,
   adminMiddleware,
   upload.array("productPicture"),
   createProduct
);

router.post("/products/:slug", getProductsBySlug);
//router.get("/category/getcategory", getCategories);

module.exports = router;
