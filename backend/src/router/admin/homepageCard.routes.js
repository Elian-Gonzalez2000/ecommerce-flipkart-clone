const express = require("express");
const {
  requiresSignin,
  adminMiddleware,
} = require("../../common-middleware/index.js");
const {
  createHomepageCard,
  updateHomepageCard,
  deleteHomepageCard,
  getAllHomepagesCards,
  getHomepageCard,
} = require("../../controller/admin/homepageCard.admin.js");
const router = express.Router();

router.get(
  "/admin/homepagecard/get",
  requiresSignin,
  adminMiddleware,
  getHomepageCard
);
router.get(
  "/admin/homepagecard/getall",
  requiresSignin,
  adminMiddleware,
  getAllHomepagesCards
);
router.post(
  "/admin/homepagecard/create",
  requiresSignin,
  adminMiddleware,
  createHomepageCard
);
router.post(
  "/admin/homepagecard/update",
  requiresSignin,
  adminMiddleware,
  updateHomepageCard
);
router.post(
  "/admin/homepagecard/delete",
  requiresSignin,
  adminMiddleware,
  deleteHomepageCard
);

module.exports = router;
