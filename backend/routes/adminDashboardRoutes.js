const express = require("express");
const authenticateAdmin = require("../middleware/authAdmin");
const adminDashboardController = require("../controllers/adminDashboardController");

const router = express.Router();

router.get("/admin/dashboard-stats", authenticateAdmin, adminDashboardController.getDashboardStats);

module.exports = router;
