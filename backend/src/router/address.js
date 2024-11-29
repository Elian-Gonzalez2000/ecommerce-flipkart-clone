const express = require("express");
const { requiresSignin, userMiddleware } = require("../common-middleware");
const {
  addAddress,
  getAddress,
  deleteAddress,
} = require("../controller/address");
const router = express.Router();

router.post("/user/address/create", requiresSignin, userMiddleware, addAddress);
router.post("/user/getaddress", requiresSignin, userMiddleware, getAddress);
router.post(
  "/user/address/delete",
  requiresSignin,
  userMiddleware,
  deleteAddress
);

module.exports = router;
