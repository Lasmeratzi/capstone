const db = require("../config/database");

// Add a new comment
const createComment = (commentData, callback) => {
  const sql = `
    INSERT INTO comments (author_id, post_id, comment_text)
    VALUES (?, ?, ?)
  `;
  const params = [commentData.author_id, commentData.post_id, commentData.comment_text];
  db.query(sql, params, callback);
};

// Get all comments for a specific post
const getCommentsByPostId = (postId, callback) => {
  const sql = `
    SELECT comments.id, comments.comment_text, comments.created_at,
           users.username AS author, users.pfp AS author_pfp
    FROM comments
    JOIN users ON comments.author_id = users.id
    WHERE comments.post_id = ?
    ORDER BY comments.created_at ASC
  `;
  db.query(sql, [postId], callback);
};

// Get a single comment by ID
const getCommentById = (commentId, callback) => {
  const sql = `
    SELECT comments.id, comments.comment_text, comments.created_at,
           users.username AS author, users.pfp AS author_pfp
    FROM comments
    JOIN users ON comments.author_id = users.id
    WHERE comments.id = ?
  `;
  db.query(sql, [commentId], callback);
};

// Update a comment
const updateComment = (commentId, commentText, callback) => {
  const sql = `
    UPDATE comments
    SET comment_text = ?
    WHERE id = ?
  `;
  db.query(sql, [commentText, commentId], callback);
};

// Delete a comment
const deleteComment = (commentId, callback) => {
  const sql = `
    DELETE FROM comments
    WHERE id = ?
  `;
  db.query(sql, [commentId], callback);
};

// Get recent comments for a specific post (limit 3 by default)
const getRecentCommentsByPostId = (postId, limit = 3, callback) => {
  const sql = `
    SELECT comments.id, comments.comment_text, comments.created_at,
           users.username AS author, users.pfp AS author_pfp
    FROM comments
    JOIN users ON comments.author_id = users.id
    WHERE comments.post_id = ?
    ORDER BY comments.created_at DESC
    LIMIT ?
  `;
  db.query(sql, [postId, limit], callback);
};

module.exports = {
  createComment,
  getCommentsByPostId,
  getCommentById,
  updateComment,
  deleteComment,
  getRecentCommentsByPostId, // add this
};
