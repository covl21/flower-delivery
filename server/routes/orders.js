// server/routes/orders.js
const express = require("express");
const Order = require("../models/Order");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { email, phone, address, products, totalPrice } = req.body;
    if (!email || !phone || !address || !products) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const newOrder = new Order({ email, phone, address, products, totalPrice });
    const saved = await newOrder.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
