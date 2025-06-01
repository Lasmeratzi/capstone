const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const commentsController = require("../controllers/commentsController");

const router = express.Router();

// Create a new comment
router.post("/comments", authenticateToken, commentsController.createComment);

// Get all comments for a specific post
router.get("/comments/:post_id", authenticateToken, commentsController.getCommentsByPostId);

// Get a single comment by ID
router.get("/comments/id/:id", authenticateToken, commentsController.getCommentById);

// Update a comment
router.patch("/comments/:id", authenticateToken, commentsController.updateComment);

// Get recent comments for a post (e.g. 3)
router.get("/comments/recent/:post_id", authenticateToken, commentsController.getRecentCommentsByPostId);

// **New route: Get comment count for a post**
router.get("/comments/count/:post_id", authenticateToken, commentsController.getCommentCount);

// Delete a comment
router.delete("/comments/:id", authenticateToken, commentsController.deleteComment);

module.exports = router;
