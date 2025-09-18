const express = require("express");
const Order = require("../models/Order");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    
    const { email, phone, address, location, products, totalPrice, appliedCoupon, discount } = req.body;

    if (!email || !phone || !address || !location || !products) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newOrder = new Order({ email, phone, address, location, products, totalPrice, appliedCoupon, discount });
    const saved = await newOrder.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/find", async (req, res) => {
  try {
    const { email, phone, orderId } = req.query;

    let order;

    if (orderId) {
      order = await Order.findById(orderId);
    } else if (email && phone) {
      order = await Order.findOne({ email, phone }).sort({ createdAt: -1 });
    } else {
      return res.status(400).json({ message: "Provide either orderId or email + phone" });
    }

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

