const express = require("express");
const {
  getAllHomepagesCards,
  getHomepageCard,
} = require("../controller/homepageCard.js");
const router = express.Router();

router.get("/homepagecard/get", getHomepageCard);
router.get("/homepagecard/getall", getAllHomepagesCards);

module.exports = router;
