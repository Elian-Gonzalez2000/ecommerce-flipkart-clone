const express = require("express");
const router = express.Router();
const { signup, signin } = require("../../controller/admin/auth.js");
const {
   validateSignupRequest,
   validateSigninRequest,
   isRequestValidated,
} = require("../../validators/auth.js");

router.post("/admin/signin", validateSigninRequest, signin);

router.post("/admin/signup", validateSignupRequest, isRequestValidated, signup);

module.exports = router;
