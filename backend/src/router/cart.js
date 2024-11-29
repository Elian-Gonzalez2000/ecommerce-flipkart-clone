const express = require("express");
const {
  requiresSignin,
  userMiddleware,
} = require("../common-middleware/index.js");
const {
  addItemToCart,
  getCartItems,
  removeCartItems,
} = require("../controller/cart.js");
const router = express.Router();

router.post("/user/getcartitems", requiresSignin, userMiddleware, getCartItems);

router.post(
  "/user/cart/addtocart",
  requiresSignin,
  userMiddleware,
  addItemToCart
);
router.post(
  "/user/cart/getcartitems",
  requiresSignin,
  userMiddleware,
  getCartItems
);

router.post(
  "/user/cart/removeitem",
  requiresSignin,
  userMiddleware,
  removeCartItems
);

module.exports = router;
