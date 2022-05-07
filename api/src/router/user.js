const express = require("express");
const router = express.Router();
const signup = require("../controller/user.js");

router.post("/signin", (req, res) => {});

router.post("/signup", signup);

module.exports = router;
