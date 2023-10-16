const express = require("express");
const { requiresSignin, userMiddleware } = require("../common-middleware");
const { addAddress, getAddress } = require("../controller/address");
const router = express.Router();

router.post("/user/address/create", requiresSignin, userMiddleware, addAddress);
router.post("/user/getaddress", requiresSignin, userMiddleware, getAddress);

module.exports = router;