const express = require("express");
const { requiresSignin } = require("../../common-middleware/index.js");
const router = express.Router();
const {
  signup,
  signin,
  signout,
  confirm,
} = require("../../controller/admin/auth.js");
const {
  validateSignupRequest,
  validateSigninRequest,
  isRequestValidated,
} = require("../../validators/auth.js");

router.post("/admin/signin", validateSigninRequest, signin);

router.post("/admin/signup", validateSignupRequest, isRequestValidated, signup);

router.post("/admin/signout", signout);

router.get("/admin/confirm/:token", confirm);

module.exports = router;
