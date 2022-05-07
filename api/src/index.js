const express = require("express");
const env = require("dotenv");
const app = express();
const mongoose = require("mongoose");
const userRoutes = require("./router/user.js");

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
app.use("/api", userRoutes);

app.get("/", (req, res, next) => {
   return res.status(200).json({
      message: "hello from server",
   });
});

app.listen(PORT || 3001, () => {
   console.log(`Server is running on PORT ${PORT || 3001}`);
});
