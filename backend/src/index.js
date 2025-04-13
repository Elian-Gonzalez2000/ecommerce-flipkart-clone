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
const {
  scraperFlipkartProducts,
  scraperFlipkartCategories,
} = require("./config/seed.js");
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
/* app.use((req, res, next) => {
  console.log(`Request Method: ${req.method}`);
  console.log(`Request URL: ${req.url}`);
  console.log("Request Headers:", req.headers);
  next();
}); */
const saveOptions = { subCategories: false, childrenCategories: true };
// scraperFlipkartCategories("Sports, Books & More", saveOptions);
scraperFlipkartProducts({
  productUrl:
    "https://www.flipkart.com/samsung-galaxy-m35-5g-thunder-grey-128-gb/p/itm94360d23ec184?pid=MOBH2Z9HJYYQBFGD&lid=LSTMOBH2Z9HJYYQBFGDSUJ7R0&marketplace=FLIPKART&fm=neo%2Fmerchandising&iid=M_85d1bc84-69ce-45e2-93a4-653ffdd79350_5_AYSX42C7U6_MC.MOBH2Z9HJYYQBFGD&ppt=browse&ppn=browse&ssid=30kkhk99gg0000001743530588523&otracker=clp_pmu_v2_Samsung%2BMobile%2Bunder%2B%25E2%2582%25B920K_1_5.productCard.PMU_V2_SAMSUNG%2BGalaxy%2BM35%2B5G%2B%2528Thunder%2BGrey%252C%2B128%2BGB%2529_samsung-mobile-store_MOBH2Z9HJYYQBFGD_neo%2Fmerchandising_0&otracker1=clp_pmu_v2_PINNED_neo%2Fmerchandising_Samsung%2BMobile%2Bunder%2B%25E2%2582%25B920K_LIST_productCard_cc_1_NA_view-all&cid=MOBH2Z9HJYYQBFGD",
  categoryId: "67e33854bc617542d9dd15b4",
  save: { product: true },
  test: false,
});
app.options("*", cors());
app.use(
  cors({
    origin: [
      "http://localhost:2000",
      "http://localhost:3000",
      "https://elian-gonzalez2000.github.io/ecommerce-flipkart-clone/client/dist/",
      "https://elian-gonzalez2000.github.io/ecommerce-flipkart-clone/admin-app/dist/",
    ],
    credentials: true,
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.post(
  "/api/stripe/webhook-stripe/checkout-session",
  express.raw({ type: "application/json" }),
  getStripeCheckoutSessionWebhook
);
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:2000",
      "http://localhost:3000",
      "https://elian-gonzalez2000.github.io",
    ],
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
