const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true }, 
  dateAdded: { type: Date, default: Date.now } 
});

const ShopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  products: [ProductSchema],
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  }
});

module.exports = mongoose.model("Shop", ShopSchema);
