const express = require("express");
const router = express.Router();
const { signup, signin, requiresSignin } = require("../controller/auth.js");
const {
   isRequestValidated,
   validateSignupRequest,
   validateSigninRequest,
} = require("../validators/auth.js");

router.post("/signin", validateSigninRequest, isRequestValidated, signin);

router.post("/signup", validateSignupRequest, isRequestValidated, signup);

router.post("/profile", requiresSignin, (req, res) => {
   res.status(200).json({ user: "profile" });
});

module.exports = router;
