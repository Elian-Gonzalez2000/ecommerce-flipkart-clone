const express = require("express");
const {
   requiresSignin,
   adminMiddleware,
} = require("../common-middleware/index.js");
const { addCategory, getCategories } = require("../controller/category.js");
const router = express.Router();

router.post("/category/create", requiresSignin, adminMiddleware, addCategory);
router.get("/category/getcategory", getCategories);

module.exports = router;
