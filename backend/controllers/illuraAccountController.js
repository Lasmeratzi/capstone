const illuraAccountModels = require("../models/IlluraAccountModels");
const fs = require("fs");
const path = require("path");

// Get Illura GCash information
const getIlluraAccount = (req, res) => {
  if (!req.admin || req.admin.role !== "super_admin") {
    return res.status(403).json({ message: "Forbidden: Super Admin privileges required." });
  }

  illuraAccountModels.getIlluraAccount((err, results) => {
    if (err) {
      console.error("Error fetching Illura account:", err);
      return res.status(500).json({ message: "Database error.", error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Illura account not found." });
    }

    res.status(200).json(results[0]);
  });
};

// Update Illura GCash information
const updateIlluraAccount = (req, res) => {
  if (!req.admin || req.admin.role !== "super_admin") {
    return res.status(403).json({ message: "Forbidden: Super Admin privileges required." });
  }

  const { gcash_number, gcash_name } = req.body;

  if (!gcash_number || !gcash_name) {
    return res.status(400).json({ message: "GCash number and name are required." });
  }

  const gcashData = {
    gcash_number,
    gcash_name,
    qr_code_path: req.file ? req.file.filename : null
  };

  illuraAccountModels.updateIlluraAccount(gcashData, (err) => {
    if (err) {
      console.error("Error updating Illura account:", err);
      return res.status(500).json({ message: "Database error.", error: err });
    }

    res.status(200).json({ message: "Illura account updated successfully." });
  });
};

// Get Illura GCash info for buyers (public endpoint)
const getIlluraGCashInfo = (req, res) => {
  illuraAccountModels.getIlluraAccount((err, results) => {
    if (err) {
      console.error("Error fetching Illura GCash info:", err);
      return res.status(500).json({ message: "Database error.", error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Illura GCash information not found." });
    }

    // Return only the necessary info for buyers
    const gcashInfo = {
      gcash_number: results[0].gcash_number,
      gcash_name: results[0].gcash_name,
      qr_code_path: results[0].qr_code_path
    };

    res.status(200).json(gcashInfo);
  });
};

module.exports = {
  getIlluraAccount,
  updateIlluraAccount,
  getIlluraGCashInfo
};