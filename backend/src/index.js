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
  scraperFlipkartListProducts,
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
/* scraperFlipkartProducts({
  productUrl:
    "https://www.flipkart.com/samsung-galaxy-s24-fe-5g-graphite-128-gb/p/itme960199e26f23?pid=MOBH4ZG33EBNZKS7&lid=LSTMOBH4ZG33EBNZKS751CITE&marketplace=FLIPKART&fm=neo%2Fmerchandising&iid=M_ba1aaf5c-1d48-4f61-a546-65f4787cc53f_1_1BUWY8OBA8L9_MC.MOBH4ZG33EBNZKS7&ppt=sp&ppn=sp&otracker=clp_pmu_v2_Latest%2BSamsung%2Bmobiles%2B_5_1.productCard.PMU_V2_SAMSUNG%2BGalaxy%2BS24%2BFE%2B5G%2B%2528Graphite%252C%2B128%2BGB%2529_samsung-mobile-store_MOBH4ZG33EBNZKS7_neo%2Fmerchandising_4&otracker1=clp_pmu_v2_PINNED_neo%2Fmerchandising_Latest%2BSamsung%2Bmobiles%2B_LIST_productCard_cc_5_NA_view-all&cid=MOBH4ZG33EBNZKS7",
  categoryId: "67e33854bc617542d9dd15b4",
  save: { product: true },
  test: true,
}); */
scraperFlipkartListProducts(
  "https://www.flipkart.com/mobiles/pr?sid=tyy%2C4io&otracker=categorytree&p%5B%5D=facets.brand%255B%255D%3DInfinix&otracker=nmenu_sub_Electronics_0_Infinix",
  "67e33854bc617542d9dd15b7",
  { test: false }
);
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
