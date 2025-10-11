const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const tagsController = require("../controllers/tagsController");

const router = express.Router();

// GET: Search tags (for autocomplete)
// Example: /api/tags/search?query=port
router.get("/tags/search", authenticateToken, tagsController.searchTags);

// GET: Get popular/trending tags
// Example: /api/tags/popular?limit=20
router.get("/tags/popular", authenticateToken, tagsController.getPopularTags);

// GET: Get all tags for a specific post
// Example: /api/tags/post/123
router.get("/tags/post/:postId", authenticateToken, tagsController.getTagsForPost);

// GET: Get all posts with a specific tag
// Example: /api/tags/portrait/posts
router.get("/tags/:tagName/posts", authenticateToken, tagsController.getPostsByTag);

// PUT: Update tags for a post
// Example: /api/tags/post/123
// Body: { tags: ["portrait", "digital art"] }
router.put("/tags/post/:postId", authenticateToken, tagsController.updatePostTags);

// DELETE: Remove all tags from a post
// Example: /api/tags/post/123
router.delete("/tags/post/:postId", authenticateToken, tagsController.removeTagsFromPost);

// DELETE: Cleanup unused tags (admin/maintenance)
// Example: /api/tags/cleanup
router.delete("/tags/cleanup", authenticateToken, tagsController.cleanupUnusedTags);

module.exports = router;