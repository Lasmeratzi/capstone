const express = require("express");
const multer = require("multer"); // For handling file uploads
const { authenticateToken } = require("../middleware/authMiddleware"); // Middleware for token authentication
const portfolioController = require("../controllers/portfolioController");

const upload = multer({ dest: "uploads/" }); // Configure Multer for file uploads

const router = express.Router();

// Create a new portfolio item
router.post("/portfolio", authenticateToken, upload.single("image"), portfolioController.createPortfolioItem);

// Get all portfolio items for the authenticated user
router.get("/portfolio", authenticateToken, portfolioController.getPortfolioItems);

// Update a portfolio item
router.patch("/portfolio/:id", authenticateToken, upload.single("image"), portfolioController.updatePortfolioItem);

// Delete a portfolio item
router.delete("/portfolio/:id", authenticateToken, portfolioController.deletePortfolioItem);

module.exports = router;