const express = require("express");
const Coupon = require("../models/Coupon");
const router = express.Router();

router.get("/:code", async (req, res) => {
  try {
    const { code } = req.params;
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    if (new Date(coupon.validUntil) < new Date()) {
      return res.status(400).json({ message: "Coupon expired" });
    }

    res.json(coupon);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
