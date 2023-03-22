const express = require("express");
const env = require("dotenv");
const cors = require("cors");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const authRoutes = require("./router/auth.js");
const adminRoutes = require("./router/admin/auth.js");
const categoryRoutes = require("./router/category.js");
const productRoutes = require("./router/product.js");
const cartRoutes = require("./router/cart.js");
const initialDataRoutes = require("./router/admin/initialData.js");
const pageRoutes = require("./router/admin/page.js");

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
   });

app.use(express.json());
app.use(
   cors({
      origin: "*",
      credentials: true,
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type", "Authorization"],
   })
); // Allow everyone to share resources
app.use("/public", express.static(path.join(__dirname, "uploads")));
app.use("/api", authRoutes);
app.use("/api", adminRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", cartRoutes);
app.use("/api", initialDataRoutes);
app.use("/api", pageRoutes);

app.get("/", (req, res, next) => {
   return res.status(200).json({
      message: "hello from server",
   });
});

app.listen(PORT || 3001, () => {
   console.log(`Server is running on PORT ${PORT || 3001}`);
});
