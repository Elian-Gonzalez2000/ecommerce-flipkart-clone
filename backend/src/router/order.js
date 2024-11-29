const {
  requiresSignin,
  userMiddleware,
} = require("../common-middleware/index.js");
const {
  addOrder,
  getOrders,
  getOrder,
  deleteOrder,
} = require("../controller/order.js");
const router = require("express").Router();

router.post("/add-order", requiresSignin, userMiddleware, addOrder);
router.get("/get-orders", requiresSignin, userMiddleware, getOrders);
router.post("/get-order", requiresSignin, userMiddleware, getOrder);
router.post("/delete-order", requiresSignin, userMiddleware, deleteOrder);

module.exports = router;
