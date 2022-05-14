const express = require("express");
const {
   requiresSignin,
   adminMiddleware,
} = require("../common-middleware/index.js");
const { createProduct } = require("../controller/product.js");
const multer = require("multer");
const shortid = require("shortid");
const path = require("path");
const router = express.Router();

const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, path.join(path.dirname(__dirname), "uploads"));
   },
   filename: function (req, file, cb) {
      cb(null, `${shortid.generate()}-${file.originalname}`);
   },
});

const upload = multer({ storage });

router.post(
   "/product/create",
   requiresSignin,
   adminMiddleware,
   upload.single("productPicture"),
   createProduct
);
//router.get("/category/getcategory", getCategories);

module.exports = router;
