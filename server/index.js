// server/index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();

const shopRoutes = require("./routes/shops");
const orderRoutes = require("./routes/orders");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.use("/images", express.static(path.join(__dirname, "public", "images")));

// API
app.use("/api/shops", shopRoutes);
app.use("/api/orders", orderRoutes);

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/flower-delivery";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error(err));

