const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware"); // Middleware for token authentication
const profileController = require("../controllers/profileController");

const router = express.Router();

// GET: Fetch logged-in user's profile
router.get("/profile", authenticateToken, profileController.getUserProfile);

// PATCH: Toggle commissions (optional, if needed)
router.patch("/profile/commissions", authenticateToken, profileController.toggleCommissions);

module.exports = router;