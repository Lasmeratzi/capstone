const commentsModel = require("../models/commentsModels");

// Create a new comment
const createComment = (req, res) => {
  const authorId = req.user.id; // Get the user ID from auth
  const { post_id, comment_text } = req.body;

  if (!comment_text) {
    return res.status(400).json({ message: "Comment text is required." });
  }

  const commentData = { author_id: authorId, post_id, comment_text };

  commentsModel.createComment(commentData, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error.", error: err });
    }
    res.status(201).json({ message: "Comment added successfully!", commentId: result.insertId });
  });
};

// Get all comments for a specific post
const getCommentsByPostId = (req, res) => {
  const { post_id } = req.params;

  commentsModel.getCommentsByPostId(post_id, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error.", error: err });
    }
    res.status(200).json(results);
  });
};

// Get a single comment by ID
const getCommentById = (req, res) => {
  const { id } = req.params;

  commentsModel.getCommentById(id, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error.", error: err });
    }
    if (!result.length) {
      return res.status(404).json({ message: "Comment not found." });
    }
    res.status(200).json(result[0]);
  });
};

// Update a comment
const updateComment = (req, res) => {
  const { id } = req.params;
  const { comment_text } = req.body;

  if (!comment_text) {
    return res.status(400).json({ message: "Updated comment text is required." });
  }

  commentsModel.updateComment(id, comment_text, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error.", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Comment not found or no changes made." });
    }
    res.status(200).json({ message: "Comment updated successfully!" });
  });
};

// Delete a comment
const deleteComment = (req, res) => {
  const { id } = req.params;

  commentsModel.deleteComment(id, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error.", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Comment not found." });
    }
    res.status(200).json({ message: "Comment deleted successfully!" });
  });
};

const getRecentCommentsByPostId = (req, res) => {
  const { post_id } = req.params;
  const limit = parseInt(req.query.limit) || 3;

  commentsModel.getRecentCommentsByPostId(post_id, limit, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error.", error: err });
    }
    res.status(200).json(results);
  });
};

module.exports = {
  createComment,
  getCommentsByPostId,
  getCommentById,
  updateComment,
  deleteComment,
  getRecentCommentsByPostId, // add this
};
