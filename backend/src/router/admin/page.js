const express = require("express");
const {
   upload,
   adminMiddleware,
   requiresSignin,
} = require("../../common-middleware/index.js");
const { createPage, getPage } = require("../../controller/admin/page.js");
const router = express.Router();

router.post(
   "/page/create",
   requiresSignin,
   adminMiddleware,
   upload.fields([
      { name: "banners", maxCount: 5 },
      { name: "products", maxCount: 5 },
   ]),
   createPage
);

router.get("/page/:category/:type", getPage);

module.exports = router;
