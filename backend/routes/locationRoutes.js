const express = require("express");
const router = express.Router();
const locationModels = require("../models/locationModels");

// ✅ GET all locations
router.get("/", (req, res) => {
  locationModels.getAllLocations((err, results) => {
    if (err) {
      console.error("❌ Database error:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json(results);
  });
});

module.exports = router;
