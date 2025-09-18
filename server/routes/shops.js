const express = require("express");
const Shop = require("../models/Shop");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const shops = await Shop.find();
    res.json(shops);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
