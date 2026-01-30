const reviewsModels = require("../models/reviewsModels");

// Submit or update review
const submitReview = (req, res) => {
  console.log("🚀 ========= SUBMIT REVIEW CALLED =========");
  console.log("📦 Full req.user object:", req.user);
  console.log("🔑 All properties in req.user:");
  if (req.user) {
    Object.keys(req.user).forEach(key => {
      console.log(`  - ${key}: ${req.user[key]} (type: ${typeof req.user[key]})`);
    });
  }
  console.log("📝 Request body:", req.body);
  console.log("==========================================");

  try {
    // Try different possible property names for user ID
    const userId = req.user.id || req.user.userId || req.user.user_id;
    
    if (!userId) {
      console.error("❌ No user ID found in token!");
      console.error("Available properties:", Object.keys(req.user));
      return res.status(400).json({
        success: false,
        message: 'User ID not found in token',
        availableProperties: Object.keys(req.user)
      });
    }

    console.log("✅ Extracted user ID:", userId);
    const { rating, reviewText } = req.body;

    // Validate input
    if (!rating || rating < 1 || rating > 5) {
      console.log("❌ Invalid rating:", rating);
      return res.status(400).json({ 
        success: false, 
        message: 'Rating must be between 1 and 5' 
      });
    }

    // Check if user already has a review
    reviewsModels.checkUserReviewExists(userId, (err, existsResults) => {
      if (err) {
        console.error("❌ Database error checking review:", err);
        console.error("❌ SQL Error code:", err.code);
        console.error("❌ SQL Error message:", err.message);
        return res.status(500).json({ 
          success: false, 
          message: 'Database error',
          error: err.message 
        });
      }

      console.log("📊 User review exists check:", existsResults);
      const hasExistingReview = existsResults && existsResults.length > 0;

      if (hasExistingReview) {
        // Update existing review
        const reviewId = existsResults[0].review_id;
        console.log("🔄 Updating existing review ID:", reviewId);
        
        reviewsModels.updateReview(reviewId, userId, rating, reviewText, (updateErr, updateResults) => {
          if (updateErr) {
            console.error("❌ Database error updating review:", updateErr);
            console.error("❌ Update SQL error details:", updateErr.sqlMessage);
            return res.status(500).json({ 
              success: false, 
              message: 'Failed to update review',
              error: updateErr.message 
            });
          }

          console.log("✅ Review updated successfully:", updateResults);
          res.status(200).json({ 
            success: true, 
            message: 'Review updated successfully!',
            reviewId: reviewId
          });
        });
      } else {
        // Create new review
        console.log("➕ Creating new review for user:", userId);
        reviewsModels.createReview(userId, rating, reviewText, (createErr, createResults) => {
          if (createErr) {
            console.error("❌ Database error creating review:", createErr);
            console.error("❌ Create SQL error:", createErr.sql);
            console.error("❌ Create SQL error details:", createErr.sqlMessage);
            return res.status(500).json({ 
              success: false, 
              message: 'Failed to create review',
              error: createErr.message,
              sqlError: createErr.sqlMessage 
            });
          }

          console.log("✅ Review created successfully:", createResults);
          res.status(200).json({ 
            success: true, 
            message: 'Review submitted successfully!',
            reviewId: createResults.insertId
          });
        });
      }
    });
  } catch (error) {
    console.error("❌ Unexpected error in submitReview:", error);
    console.error("❌ Error stack:", error.stack);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Get all reviews for about page
const getAllReviews = (req, res) => {
  console.log("📚 Getting all reviews");
  reviewsModels.getAllReviews((err, results) => {
    if (err) {
      console.error("❌ Database error fetching reviews:", err);
      return res.status(500).json({ 
        success: false, 
        message: 'Database error', 
        reviews: [] 
      });
    }

    console.log(`✅ Found ${results?.length || 0} reviews`);
    res.status(200).json({ 
      success: true, 
      reviews: results || [],
      count: results?.length || 0
    });
  });
};

// Get user's own review
const getUserReview = (req, res) => {
  console.log("👤 Getting user's review");
  console.log("📦 req.user object:", req.user);
  
  try {
    const userId = req.user.id || req.user.userId || req.user.user_id;
    
    if (!userId) {
      console.error("❌ No user ID found for getUserReview");
      return res.status(400).json({ 
        success: false, 
        message: 'User ID not found in token',
        review: null
      });
    }

    console.log("🔍 Looking for review for user ID:", userId);
    reviewsModels.getUserReview(userId, (err, results) => {
      if (err) {
        console.error("❌ Database error fetching user review:", err);
        return res.status(500).json({ 
          success: false, 
          message: 'Database error',
          review: null
        });
      }

      console.log("📊 User review results:", results);
      res.status(200).json({ 
        success: true, 
        review: results.length > 0 ? results[0] : null,
        hasReview: results.length > 0
      });
    });
  } catch (error) {
    console.error("❌ Error in getUserReview:", error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      review: null
    });
  }
};

// Delete user's review
const deleteReview = (req, res) => {
  console.log("🗑️ Deleting review");
  try {
    const userId = req.user.id || req.user.userId || req.user.user_id;
    const { reviewId } = req.params;

    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID not found in token' 
      });
    }

    console.log(`🗑️ Deleting review ${reviewId} for user ${userId}`);
    reviewsModels.deleteReview(reviewId, userId, (err, results) => {
      if (err) {
        console.error("❌ Database error deleting review:", err);
        return res.status(500).json({ 
          success: false, 
          message: 'Database error' 
        });
      }

      if (results.affectedRows === 0) {
        console.log("❌ No review found to delete");
        return res.status(404).json({ 
          success: false, 
          message: 'Review not found or unauthorized' 
        });
      }

      console.log("✅ Review deleted successfully");
      res.status(200).json({ 
        success: true, 
        message: 'Review deleted successfully' 
      });
    });
  } catch (error) {
    console.error("❌ Error in deleteReview:", error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Get review statistics
const getReviewStats = (req, res) => {
  console.log("📊 Getting review statistics");
  try {
    // Get average rating and count
    reviewsModels.getAverageRating((avgErr, avgResults) => {
      if (avgErr) {
        console.error("❌ Database error fetching average rating:", avgErr);
        return res.status(500).json({ 
          success: false, 
          message: 'Database error fetching statistics' 
        });
      }

      reviewsModels.getReviewsCount((countErr, countResults) => {
        if (countErr) {
          console.error("❌ Database error fetching reviews count:", countErr);
          return res.status(500).json({ 
            success: false, 
            message: 'Database error fetching statistics' 
          });
        }

        reviewsModels.getRatingBreakdown((breakdownErr, breakdownResults) => {
          if (breakdownErr) {
            console.error("❌ Database error fetching rating breakdown:", breakdownErr);
            return res.status(500).json({ 
              success: false, 
              message: 'Database error fetching statistics' 
            });
          }

          const averageRating = avgResults[0]?.avgRating || 0;
          const totalReviews = countResults[0]?.count || 0;

          console.log(`📊 Stats: Avg ${averageRating}, Total ${totalReviews}`);
          res.status(200).json({
            success: true,
            averageRating: parseFloat(averageRating).toFixed(1),
            totalReviews: totalReviews,
            ratingBreakdown: breakdownResults || []
          });
        });
      });
    });
  } catch (error) {
    console.error("❌ Error in getReviewStats:", error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Get recent reviews (for home page widget)
const getRecentReviews = (req, res) => {
  console.log("🕒 Getting recent reviews");
  try {
    const limit = parseInt(req.query.limit) || 5;
    console.log(`🔍 Limit: ${limit}`);

    reviewsModels.getRecentReviews(limit, (err, results) => {
      if (err) {
        console.error("❌ Database error fetching recent reviews:", err);
        return res.status(500).json({ 
          success: false, 
          message: 'Database error',
          reviews: []
        });
      }

      console.log(`✅ Found ${results?.length || 0} recent reviews`);
      res.status(200).json({ 
        success: true, 
        reviews: results || [],
        count: results?.length || 0
      });
    });
  } catch (error) {
    console.error("❌ Error in getRecentReviews:", error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      reviews: []
    });
  }
};

// Test route
const testRoute = (req, res) => {
  console.log("✅ Reviews API test route hit");
  res.status(200).json({
    success: true,
    message: "Reviews API is working!",
    time: new Date().toISOString(),
    user: req.user || "No user in request"
  });
};

module.exports = {
  submitReview,
  getAllReviews,
  getUserReview,
  deleteReview,
  getReviewStats,
  getRecentReviews,
  testRoute
};