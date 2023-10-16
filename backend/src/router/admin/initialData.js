const express = require("express");
const {
   requiresSignin,
   adminMiddleware,
} = require("../../common-middleware/index.js");
const { initialData } = require("../../controller/admin/initialData");
const router = express.Router();

router.post("/initialdata", requiresSignin, adminMiddleware, initialData);

module.exports = router;
