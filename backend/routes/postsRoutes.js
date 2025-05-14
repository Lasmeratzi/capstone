const express = require("express");
const multer = require("multer");
const { authenticateToken } = require("../middleware/authMiddleware");
const postsController = require("../controllers/postsController");

const upload = multer({ dest: "uploads/" });

const router = express.Router();

// Create a new post
router.post("/posts", authenticateToken, upload.single("media"), postsController.createPost);

// Get all posts (supports optional author filtering)
router.get("/posts", authenticateToken, postsController.getAllPosts);

// Get posts by the logged-in user
router.get("/posts/user", authenticateToken, postsController.getUserPosts); // New route

// Get a post by ID
router.get("/posts/:id", authenticateToken, postsController.getPostById);

// Update a post
router.patch("/posts/:id", authenticateToken, upload.single("media"), postsController.updatePost);

// Update post status (Admin moderation feature)
router.patch("/posts/:id/status", authenticateToken, postsController.updatePostStatus); // 🚀 New route for moderation

// Delete a post
router.delete("/posts/:id", authenticateToken, postsController.deletePost);

module.exports = router;