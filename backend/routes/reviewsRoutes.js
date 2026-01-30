const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/authMiddleware");
const reviewsController = require("../controllers/reviewsController");

// ✅ TEST ROUTE (no auth required)
router.get("/test", reviewsController.testRoute);

// ✅ POST - Submit or update review (requires authentication)
router.post("/submit", authenticateToken, reviewsController.submitReview);

// ✅ GET - Get all reviews for about page (no auth required for public viewing)
router.get("/all", reviewsController.getAllReviews);

// ✅ GET - Get user's own review (requires authentication)
router.get("/myreview", authenticateToken, reviewsController.getUserReview);

// ✅ DELETE - Delete user's review (requires authentication)
router.delete("/delete/:reviewId", authenticateToken, reviewsController.deleteReview);

// ✅ GET - Get review statistics (no auth required for public viewing)
router.get("/stats", reviewsController.getReviewStats);

// ✅ GET - Get recent reviews for home widget (no auth required for public viewing)
router.get("/recent", reviewsController.getRecentReviews);

module.exports = router;