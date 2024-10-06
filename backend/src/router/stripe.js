const {
  addStripeOrder,
  getStripeCheckoutSessionWebhook,
} = require("../controller/stripe.js");
const router = require("express").Router();

router.post(
  "/create-checkout-session-stripe",
  // requiresSignin,
  // userMiddleware,
  addStripeOrder
);
router.post(
  "/webhook-stripe/checkout-session",
  getStripeCheckoutSessionWebhook
);

module.exports = router;
