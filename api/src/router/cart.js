const express = require("express");
const {
   requiresSignin,
   userMiddleware,
} = require("../common-middleware/index.js");
const { addItemToCart } = require("../controller/cart.js");
const router = express.Router();

router.post(
   "/user/cart/addtocart",
   requiresSignin,
   userMiddleware,
   addItemToCart
);

module.exports = router;
