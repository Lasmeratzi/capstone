// routes/autoReplyRoutes.js
const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const autoReplyController = require("../controllers/autoReplyController");

const router = express.Router();

// Create auto-reply for a portfolio item (owner only)
router.post("/", authenticateToken, autoReplyController.createAutoReply);

// Update auto-reply (owner only)
router.put("/:portfolioItemId", authenticateToken, autoReplyController.updateAutoReply);

// Delete auto-reply (owner only)
router.delete("/:portfolioItemId", authenticateToken, autoReplyController.deleteAutoReply);

// Get auto-reply for a portfolio item (visitor uses this when inquiring)
router.get("/:portfolioItemId", authenticateToken, autoReplyController.getAutoReplyByItem);

// Get all current user's auto replies
router.get("/", authenticateToken, autoReplyController.getUserAutoReplies);

module.exports = router;
