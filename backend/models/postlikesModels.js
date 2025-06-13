const db = require("../config/database");

// Add a like to a post
const addLike = (postId, userId, callback) => {
  const sql = `INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)`;
  db.query(sql, [postId, userId], callback);
};

// Remove a like from a post
const removeLike = (postId, userId, callback) => {
  const sql = `DELETE FROM post_likes WHERE post_id = ? AND user_id = ?`;
  db.query(sql, [postId, userId], callback);
};

// Check if a user liked a specific post
const checkIfLiked = (postId, userId, callback) => {
  const sql = `SELECT * FROM post_likes WHERE post_id = ? AND user_id = ?`;
  db.query(sql, [postId, userId], callback);
};

// Get total like count for a post
const getLikeCount = (postId, callback) => {
  const sql = `SELECT COUNT(*) AS likeCount FROM post_likes WHERE post_id = ?`;
  db.query(sql, [postId], callback);
};

const hasUserLiked = (postId, userId, callback) => {
  const sql = `SELECT COUNT(*) AS liked FROM post_likes WHERE post_id = ? AND user_id = ?`;
  db.query(sql, [postId, userId], callback);
};


module.exports = {
  addLike,
  removeLike,
  checkIfLiked,
  getLikeCount,
  hasUserLiked,
};
