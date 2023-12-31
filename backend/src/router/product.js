const express = require("express");
const {
   requiresSignin,
   adminMiddleware,
} = require("../common-middleware/index.js");
const {
   createProduct,
   getProductsBySlug,
   getProductDetailsById,
   deleteProductById,
   getProducts,
} = require("../controller/product.js");
const multer = require("multer");
const router = express.Router();
const shortid = require("shortid");
const path = require("path");

// const storage = multer.diskStorage({
//    destination: function (req, file, cb) {
//       cb(null, path.join(path.dirname(__dirname), "../uploads"));
//    },
//    filename: function (req, file, cb) {
//       cb(null, `${shortid.generate()}-${file.originalname}`);
//    },
// });
//console.log(path.join(path.dirname(__dirname), "uploads"));
// const upload = multer({ storage });

router.post(
   "/product/create",
   requiresSignin,
   adminMiddleware,
   // upload.array("productPicture"),
   createProduct
);

router.post("/products/:slug", getProductsBySlug);
router.get("/product/:productId", getProductDetailsById);
router.delete(
   "/product/deleteproductbyid",
   requiresSignin,
   adminMiddleware,
   deleteProductById
);
router.post(
   "/product/getproducts",
   requiresSignin,
   adminMiddleware,
   getProducts
);

module.exports = router;
