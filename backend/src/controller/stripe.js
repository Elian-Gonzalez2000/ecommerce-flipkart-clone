const Stripe = require("stripe");
const axios = require("axios");

const stripe = Stripe(process.env.SECRET_KEY_STRIPE);

exports.addStripeOrder = async (req, res) => {
  const { items } = req.body;
  console.log("authorization", req.headers.authorization);

  try {
    const order = await axios({
      method: "POST",
      baseURL: "https://flipkart-rest-server-jvxd.onrender.com/api",
      url: "/add-order",
      data: req.body,
      headers: {
        Authorization: req.headers.authorization,
      },
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map((item) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: item.productId,
          },
          unit_amount: item.payablePrice,
        },
        quantity: item.purchasedQty,
      })),
      mode: "payment",
      success_url: `https://elian-gonzalez2000.github.io/ecommerce-flipkart-clone/client/dist/#/checkout/success/${order.data.order._id}`,
      cancel_url: `https://elian-gonzalez2000.github.io/ecommerce-flipkart-clone/client/dist/#/checkout/cancel/${order.data.order._id}`,
    });

    if (session && order.status == 201) {
      return res.status(200).json({ id: session.id });
    }
  } catch (error) {
    res.status(400).json({ message: "something went wrong", error: error });
  }
};

exports.getStripeCheckoutSessionWebhook = (req, res) => {
  const signature = req.headers["stripe-signature"];
  let event;
  //console.log("BODY_:", req.body);
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      "whsec_bce21eabafa80fe15348cd171fce9aa2bdd0eb409639a05db966fb09834e9539"
    );
    // console.log("event: ", event);

    if (event) {
      return res.status(200).json({ event });
    }
  } catch (err) {
    console.error("Webhook signature verification failed.", err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
};
