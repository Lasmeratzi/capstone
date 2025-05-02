const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware"); // Middleware for token authentication
const profileController = require("../controllers/profileController");

const router = express.Router();

// GET: Fetch logged-in user's profile
router.get("/profile", authenticateToken, profileController.getUserProfile);

// GET: Fetch logged-in user's data (e.g., ID, username)
router.get("/user", authenticateToken, (req, res) => {
  if (!req.user) {
    return res.status(404).json({ message: "User not found." });
  }
  res.status(200).json(req.user); // Return the logged-in user's data
});

// GET: Fetch another user's profile by ID
router.get("/profile/:id", authenticateToken, profileController.getUserProfileById);

router.get("/search", authenticateToken, profileController.searchUsers); // Search profiles by username

// PATCH: Toggle commissions (optional, if needed)
router.patch("/profile/commissions", authenticateToken, profileController.toggleCommissions);

module.exports = router;