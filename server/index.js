const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();

const shopRoutes = require("./routes/shops");
const orderRoutes = require("./routes/orders");
const couponRoutes = require("./routes/coupons"); 

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ["http://localhost:5173", "https://flower-delivery-kl24.vercel.app"], 
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  credentials: true
}));

app.use(bodyParser.json());
app.use("/images", express.static(path.join(__dirname, "public", "images")));

app.use("/api/shops", shopRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/coupons", couponRoutes);

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/flower-delivery";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error(err));
