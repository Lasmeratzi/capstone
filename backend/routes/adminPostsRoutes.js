const express = require("express");
const router = express.Router();
const authenticateAdmin = require("../middleware/authAdmin");
const adminPostsController = require("../controllers/adminPostsController");

console.log("✅ adminPostsRoutes.js is loaded");

// Get ALL posts for admin with filters
router.get("/admin/posts", authenticateAdmin, adminPostsController.getAllPostsForAdmin);

// Get users for filter dropdown
router.get("/admin/posts/users", authenticateAdmin, adminPostsController.getUsersForFilter);

// Update post status (Admin only)
router.patch("/admin/posts/:id/status", authenticateAdmin, adminPostsController.updatePostStatusAdmin);

// Delete post (Admin only)
router.delete("/admin/posts/:id", authenticateAdmin, adminPostsController.deletePostAdmin);

module.exports = router;