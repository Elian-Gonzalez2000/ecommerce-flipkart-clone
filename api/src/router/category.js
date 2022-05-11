const express = require("express");
const {
   requiresSignin,
   adminMiddleware,
} = require("../common-middleware/index.js");
const { addCategory, getCategories } = require("../controller/category.js");
const router = express.Router();

Router.post("/category/create", requiresSignin, adminMiddleware, addCategory);
Router.get("/category/getcategory", getCategories);

module.exports = router;
