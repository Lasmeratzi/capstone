const db = require("../config/database");

// Add a like
const addLike = (artworkPostId, userId, callback) => {
  const sql = `INSERT INTO artwork_post_likes (artwork_post_id, user_id) VALUES (?, ?)`;
  db.query(sql, [artworkPostId, userId], callback);
};

// Remove a like
const removeLike = (artworkPostId, userId, callback) => {
  const sql = `DELETE FROM artwork_post_likes WHERE artwork_post_id = ? AND user_id = ?`;
  db.query(sql, [artworkPostId, userId], callback);
};

// Check if user liked
const checkIfLiked = (artworkPostId, userId, callback) => {
  const sql = `SELECT * FROM artwork_post_likes WHERE artwork_post_id = ? AND user_id = ?`;
  db.query(sql, [artworkPostId, userId], callback);
};

// Get like count
const getLikeCount = (artworkPostId, callback) => {
  const sql = `SELECT COUNT(*) AS likeCount FROM artwork_post_likes WHERE artwork_post_id = ?`;
  db.query(sql, [artworkPostId], callback);
};

// Check if user liked (boolean)
const hasUserLiked = (artworkPostId, userId, callback) => {
  const sql = `SELECT COUNT(*) AS liked FROM artwork_post_likes WHERE artwork_post_id = ? AND user_id = ?`;
  db.query(sql, [artworkPostId, userId], callback);
};

module.exports = {
  addLike,
  removeLike,
  checkIfLiked,
  getLikeCount,
  hasUserLiked,
};
