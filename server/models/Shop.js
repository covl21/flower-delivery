// server/models/Shop.js
const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true }, // full URL to an image
  dateAdded: { type: Date, default: Date.now } 
});

const ShopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  products: [ProductSchema]
});

module.exports = mongoose.model("Shop", ShopSchema);
