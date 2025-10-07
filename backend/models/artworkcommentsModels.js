const db = require("../config/database");

// Add new comment
const createComment = (commentData, callback) => {
  const sql = `
    INSERT INTO artwork_comments (author_id, artwork_post_id, comment_text)
    VALUES (?, ?, ?)
  `;
  db.query(sql, [commentData.author_id, commentData.artwork_post_id, commentData.comment_text], callback);
};

// Get all comments for an artwork post
const getCommentsByArtworkPostId = (artworkPostId, callback) => {
  const sql = `
    SELECT ac.id, ac.comment_text, ac.created_at,
           u.username AS author, u.pfp AS author_pfp, ac.author_id
    FROM artwork_comments ac
    JOIN users u ON ac.author_id = u.id
    WHERE ac.artwork_post_id = ?
    ORDER BY ac.created_at ASC
  `;
  db.query(sql, [artworkPostId], callback);
};

// Get a single comment
const getCommentById = (commentId, callback) => {
  const sql = `
    SELECT ac.id, ac.comment_text, ac.created_at, ac.author_id,
           u.username AS author, u.pfp AS author_pfp
    FROM artwork_comments ac
    JOIN users u ON ac.author_id = u.id
    WHERE ac.id = ?
  `;
  db.query(sql, [commentId], callback);
};

// Update a comment
const updateComment = (commentId, commentText, callback) => {
  const sql = `
    UPDATE artwork_comments
    SET comment_text = ?
    WHERE id = ?
  `;
  db.query(sql, [commentText, commentId], callback);
};

// Delete a comment
const deleteComment = (commentId, callback) => {
  const sql = `
    DELETE FROM artwork_comments
    WHERE id = ?
  `;
  db.query(sql, [commentId], callback);
};

// Get recent comments for artwork post
const getRecentCommentsByArtworkPostId = (artworkPostId, limit = 3, callback) => {
  const sql = `
    SELECT ac.id, ac.comment_text, ac.created_at,
           u.username AS author, u.pfp AS author_pfp
    FROM artwork_comments ac
    JOIN users u ON ac.author_id = u.id
    WHERE ac.artwork_post_id = ?
    ORDER BY ac.created_at DESC
    LIMIT ?
  `;
  db.query(sql, [artworkPostId, limit], callback);
};

// Get comment count
const getCommentCountByArtworkPostId = (artworkPostId, callback) => {
  const sql = "SELECT COUNT(*) AS count FROM artwork_comments WHERE artwork_post_id = ?";
  db.query(sql, [artworkPostId], (err, results) => {
    if (err) return callback(err);
    callback(null, results[0].count);
  });
};

module.exports = {
  createComment,
  getCommentsByArtworkPostId,
  getCommentById,
  updateComment,
  deleteComment,
  getCommentCountByArtworkPostId,
  getRecentCommentsByArtworkPostId,
};
