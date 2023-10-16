const express = require("express");
const {
   requiresSignin,
   adminMiddleware,
} = require("../../common-middleware/index.js");
const {
   updateOrder,
   getCustomerOrders,
} = require("../../controller/admin/order.admin.js");
const router = express.Router();

router.post(`/order/update`, requiresSignin, adminMiddleware, updateOrder);
router.post(
   `/order/get-customer-orders`,
   requiresSignin,
   adminMiddleware,
   getCustomerOrders
);

module.exports = router;
