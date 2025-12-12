const express = require("express");
const multer = require("multer");
const { authenticateToken } = require("../middleware/authMiddleware");
const postsController = require("../controllers/postsController");

const upload = multer({ dest: "uploads/" });

const router = express.Router();

console.log("✅ postsRoutes.js is loaded");

// Log all requests to posts routes
router.use((req, res, next) => {
  console.log(`📝 Posts route accessed: ${req.method} ${req.originalUrl}`);
  next();
});

// Create a new post
router.post("/posts", authenticateToken, upload.single("media"), postsController.createPost);

// Get all posts (supports optional author filtering)
router.get("/posts", authenticateToken, postsController.getAllPosts);

// Get posts from followed users only - MUST COME BEFORE /posts/:id
router.get("/posts/following", authenticateToken, postsController.getFollowingPosts);

// Get posts by the logged-in user
router.get("/posts/user", authenticateToken, postsController.getUserPosts);

// Get a post by ID - THIS COMES AFTER /posts/following
router.get("/posts/:id", authenticateToken, postsController.getPostById);

// Update a post (Only if user is the author)
router.patch("/posts/:id", authenticateToken, upload.single("media"), postsController.updatePost);

// Update post status (Admin moderation feature)
router.patch("/posts/:id/status", authenticateToken, postsController.updatePostStatus);

// Delete a post (Only if user is the author)
router.delete("/posts/:id", authenticateToken, postsController.deletePost);

module.exports = router;