const mongoose = require("mongoose");

const CartItemSchema = new mongoose.Schema({
  productId: String,
  name: String,
  price: Number,
  quantity: Number,
  image: String
});

const OrderSchema = new mongoose.Schema({
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  location: {   
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  products: [CartItemSchema],
  totalPrice: { type: Number, required: true },
  appliedCoupon: { type: String, default: "" }, 
  discount: { type: Number, default: 0 },       
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", OrderSchema);
