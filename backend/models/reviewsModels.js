const db = require("../config/database");




// Create a new review
const createReview = (userId, rating, reviewText, callback) => {
  const sql = `
    INSERT INTO reviews (user_id, rating, review_text) 
    VALUES (?, ?, ?)
  `;
  db.query(sql, [userId, rating, reviewText], callback);
};

// Get all reviews with user details
const getAllReviews = (callback) => {
  const sql = `
    SELECT r.review_id, r.user_id, r.rating, r.review_text, r.created_at,
           u.username, u.pfp as profile_picture, u.fullname
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    ORDER BY r.created_at DESC
  `;
  db.query(sql, callback);
};

// Get user's review
const getUserReview = (userId, callback) => {
  const sql = `
    SELECT r.*, u.username, u.pfp as profile_picture, u.fullname
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.user_id = ?
    LIMIT 1
  `;
  db.query(sql, [userId], callback);
};

// Update review
const updateReview = (reviewId, userId, rating, reviewText, callback) => {
  const sql = `
    UPDATE reviews 
    SET rating = ?, review_text = ?, created_at = CURRENT_TIMESTAMP
    WHERE review_id = ? AND user_id = ?
  `;
  db.query(sql, [rating, reviewText, reviewId, userId], callback);
};

// Delete review
const deleteReview = (reviewId, userId, callback) => {
  const sql = `
    DELETE FROM reviews 
    WHERE review_id = ? AND user_id = ?
  `;
  db.query(sql, [reviewId, userId], callback);
};

// Get average rating
const getAverageRating = (callback) => {
  const sql = `
    SELECT COALESCE(AVG(rating), 0) as avgRating 
    FROM reviews
  `;
  db.query(sql, callback);
};

// Get total reviews count
const getReviewsCount = (callback) => {
  const sql = `
    SELECT COUNT(*) as count 
    FROM reviews
  `;
  db.query(sql, callback);
};

// Get rating breakdown
const getRatingBreakdown = (callback) => {
  const sql = `
    SELECT rating, COUNT(*) as count 
    FROM reviews 
    GROUP BY rating 
    ORDER BY rating DESC
  `;
  db.query(sql, callback);
};

// Check if user has existing review
const checkUserReviewExists = (userId, callback) => {
  const sql = `
    SELECT review_id 
    FROM reviews 
    WHERE user_id = ? 
    LIMIT 1
  `;
  db.query(sql, [userId], callback);
};

// Get recent reviews (for home page)
const getRecentReviews = (limit, callback) => {
  const sql = `
    SELECT r.*, u.username, u.pfp as profile_picture, u.fullname
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    ORDER BY r.created_at DESC
    LIMIT ?
  `;
  db.query(sql, [limit], callback);
};



module.exports = {
  createReview,
  getAllReviews,
  getUserReview,
  updateReview,
  deleteReview,
  getAverageRating,
  getReviewsCount,
  getRatingBreakdown,
  checkUserReviewExists,
  getRecentReviews
};