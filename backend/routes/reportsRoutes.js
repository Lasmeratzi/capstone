// routes/reportsRoutes.js
const express = require("express");
const router = express.Router();
const reportsController = require("../controllers/reportsController");
const authenticateAdmin = require("../middleware/authAdmin");
const { authenticateToken } = require("../middleware/authMiddleware");

console.log("✅ Reports routes loaded"); // Add this to debug

// User submits report
router.post("/reports", authenticateToken, reportsController.submitReport);

// Admin routes
router.get("/admin/reports", authenticateAdmin, reportsController.getAllReports);
router.get("/admin/reports/status/:status", authenticateAdmin, reportsController.getReportsByStatus);
router.patch("/admin/reports/:id", authenticateAdmin, reportsController.updateReport);

// Test route (no auth needed)
router.get("/test-reports", (req, res) => {
  console.log("📢 Test route hit!");
  res.json({ message: "Reports routes are working!", success: true });
});

module.exports = router;