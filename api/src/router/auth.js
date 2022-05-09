const express = require("express");
const router = express.Router();
const { signup, signin, requiresSignin } = require("../controller/auth.js");

router.post("/signin", signin);

router.post("/signup", signup);

router.post("/profile", requiresSignin, (req, res) => {
   res.status(200).json({ user: "profile" });
});

module.exports = router;
