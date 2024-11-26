const express = require("express");
const env = require("dotenv");
const cors = require("cors");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const authRoutes = require("./router/auth.js");
const addressRoutes = require("./router/address.js");
const adminRoutes = require("./router/admin/auth.js");
const categoryRoutes = require("./router/category.js");
const stripeRoutes = require("./router/stripe.js");
const productRoutes = require("./router/product.js");
const cartRoutes = require("./router/cart.js");
const initialDataRoutes = require("./router/admin/initialData.js");
const pageRoutes = require("./router/admin/page.js");
const orderRoutes = require("./router/order.js");
const adminOrderRoute = require("./router/admin/order.routes.js");
const fs = require("fs");
const https = require("https");
const { getStripeCheckoutSessionWebhook } = require("./controller/stripe.js");

env.config();

// destructuring environment variables
const { PORT, MONGO_DB_USER, MONGO_DB_PASSWORD, MONGO_DB_DATABASE } =
  process.env;

//Mongoose connection
mongoose
  .connect(
    `mongodb+srv://${MONGO_DB_USER}:${MONGO_DB_PASSWORD}@ecommerceflipkartclone.zxzih.mongodb.net/${MONGO_DB_DATABASE}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Database Connected");
  })
  .catch((error) => console.log(error.message));

// This is the route for the Stripe webhook endpoint and is before the express.json() middleware so that the bodyParser middleware can parse the raw body of the request
app.options("*", cors());
app.use(
  cors({
    origin: ["http://localhost:2000", "http://localhost:2000"],
    credentials: true,
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.post(
  "/api/stripe/webhook-stripe/checkout-session",
  cors(),
  express.raw({ type: "application/json" }),
  getStripeCheckoutSessionWebhook
);
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:2000", "http://localhost:2000"],
    credentials: true,
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
); // Allow everyone to share resources
app.use(express.static(path.join(__dirname, "./public")));
app.use((req, res, next) => {
  console.log(`Se ha realizado una petición a la ruta: ${req.path}`);
  next(); // Continuar al siguiente middleware o ruta
});
app.use("/api", authRoutes);
app.use("/api", addressRoutes);
app.use("/api", adminRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", cartRoutes);
app.use("/api", initialDataRoutes);
app.use("/api", pageRoutes);
app.use("/api", orderRoutes);
app.use("/api", adminOrderRoute);
app.use("/api/stripe", stripeRoutes);

app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: `hello from server: ${req.protocol + "://" + req.get("host")}`,
  });
});

/* https
  .createServer(
    {
      cert: fs.readFileSync("local.crt"),
      key: fs.readFileSync("local.key"),
    },
    app
  )
  .listen(PORT, function () {
    console.log(`Server HTTPS is running on PORT ${PORT || 3001}`);
  }); */

app.listen(PORT, function () {
  console.log(`Server HTTP is running on PORT ${PORT || 3001}`);
});
