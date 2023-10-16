const {
   requiresSignin,
   userMiddleware,
} = require("../common-middleware/index.js");
const { addOrder, getOrders, getOrder } = require("../controller/order.js");
const router = require("express").Router();

router.post("/add-order", requiresSignin, userMiddleware, addOrder);
router.get("/get-orders", requiresSignin, userMiddleware, getOrders);
router.post("/get-order", requiresSignin, userMiddleware, getOrder);

module.exports = router;
