// routes/autoReplyRoutes.js
const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const autoReplyController = require("../controllers/autoReplyController");

const router = express.Router();

// ========== EXISTING ROUTES (updated to support inquiry_type in body/query) ==========

// Create auto-reply for a portfolio item (owner only)
// POST /api/auto-replies
// Body: { portfolioItemId, reply_text, inquiry_type }
router.post("/", authenticateToken, autoReplyController.createAutoReply);

// Update auto-reply (owner only)
// PUT /api/auto-replies/:portfolioItemId
// Body: { reply_text, inquiry_type }
router.put("/:portfolioItemId", authenticateToken, autoReplyController.updateAutoReply);

// Delete auto-reply (owner only)
// DELETE /api/auto-replies/:portfolioItemId
// Body: { inquiry_type } - Optional, defaults to 'price'
router.delete("/:portfolioItemId", authenticateToken, autoReplyController.deleteAutoReply);

// Get auto-reply for a portfolio item (visitor uses this when inquiring)
// GET /api/auto-replies/:portfolioItemId
// Query: ?inquiry_type=price (optional - if not provided, returns all types for the item)
router.get("/:portfolioItemId", authenticateToken, autoReplyController.getAutoReplyByItem);

// Get all current user's auto replies
// GET /api/auto-replies
router.get("/", authenticateToken, autoReplyController.getUserAutoReplies);

// ========== NEW ROUTES ==========

// Get all auto-replies for a specific portfolio item (owner only)
// GET /api/auto-replies/item/:portfolioItemId/all
router.get("/item/:portfolioItemId/all", authenticateToken, autoReplyController.getPortfolioItemAutoReplies);

// Batch update all auto-replies for a portfolio item (owner only)
// PUT /api/auto-replies/item/:portfolioItemId/batch
// Body: { autoReplies: { price: "text", availability: "text", contact: "text" } }
router.put("/item/:portfolioItemId/batch", authenticateToken, autoReplyController.batchUpdateAutoReplies);

module.exports = router;