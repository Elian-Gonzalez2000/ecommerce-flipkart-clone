const Order = require("../models/order");
const Cart = require("../models/cart");
const Address = require("../models/address");
// const Stripe = require("stripe");
const { sign } = require("jsonwebtoken");

exports.addOrder = (req, res) => {
  Cart.deleteOne({ user: req.user_id }).exec((error, result) => {
    if (error) return res.status(400).json({ error });
    if (result) {
      req.body.user = req.user._id;
      req.body.orderStatus = [
        {
          type: "ordered",
          date: new Date(),
          isCompleted: true,
        },
        {
          type: "packed",
          isCompleted: false,
        },
        {
          type: "shipped",
          isCompleted: false,
        },
        {
          type: "delivered",
          isCompleted: false,
        },
      ];
      const order = new Order(req.body);
      order.save((error, order) => {
        if (error) return res.status(400).json({ error });
        if (order) {
          res.status(201).json({ order });
        }
      });
    }
  });
};

// const stripe = Stripe(process.env.SECRET_KEY_STRIPE);

// exports.addStripeOrder = async (req, res) => {
//   const { items } = req.body;

//   try {
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: items.map((item) => ({
//         price_data: {
//           currency: "eur",
//           product_data: {
//             name: item.productId,
//           },
//           unit_amount: item.payablePrice,
//         },
//         quantity: item.purchasedQty,
//       })),
//       mode: "payment",
//       success_url: "http://localhost:3000/",
//       cancel_url: "http://localhost:3000/cart",
//     });

//     res.status(200).json({ id: session.id });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.getStripeCheckoutSessionWebhook = (req, res) => {
//   const signature = req.headers["stripe-signature"];
//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(
//       req.body,
//       signature,
//       "whsec_bce21eabafa80fe15348cd171fce9aa2bdd0eb409639a05db966fb09834e9539"
//     );
//     console.log("event: ", event);

//     if (event.object.object == "checkout.session") {
//       return res.status(200).json({ event });
//     }
//   } catch (err) {
//     console.error("Webhook signature verification failed.", err);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }
// };

exports.getOrders = (req, res) => {
  Order.find({ user: req.user._id })
    .select("_id paymentStatus items")
    .populate("items.productId", "_id name productPictures")
    .exec((error, orders) => {
      if (error) return res.status(400).json({ error });
      if (orders) {
        res.status(200).json({ orders });
      }
    });
};

exports.getOrder = (req, res) => {
  Order.findOne({ _id: req.body.orderId })
    .populate("items.productId", "_id name productPictures")
    .lean()
    .exec((error, order) => {
      if (error) return res.status(400).json({ error });
      if (order) {
        Address.findOne({
          user: req.user._id,
        }).exec((error, address) => {
          if (error) return res.status(400).json({ error });
          order.address = address.address.find(
            (adr) => adr._id.toString() == order.addressId.toString()
          );
          res.status(200).json({
            order,
          });
        });
      }
    });
};
