const artworkCommentsModel = require("../models/artworkcommentsModels");

// Create a new comment
const createComment = (req, res) => {
  const authorId = req.user.id;
  const { artwork_post_id, comment_text } = req.body;

  if (!comment_text) {
    return res.status(400).json({ message: "Comment text is required." });
  }

  const commentData = { author_id: authorId, artwork_post_id, comment_text };

  artworkCommentsModel.createComment(commentData, (err, result) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });
    res.status(201).json({ message: "Comment added successfully!", commentId: result.insertId });
  });
};

// Get all comments for a specific artwork post
const getCommentsByArtworkPostId = (req, res) => {
  const { artwork_post_id } = req.params;

  artworkCommentsModel.getCommentsByArtworkPostId(artwork_post_id, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });
    res.status(200).json(results);
  });
};

// Get a single comment by ID
const getCommentById = (req, res) => {
  const { id } = req.params;

  artworkCommentsModel.getCommentById(id, (err, result) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });
    if (!result.length) return res.status(404).json({ message: "Comment not found." });
    res.status(200).json(result[0]);
  });
};

// Update a comment
const updateComment = (req, res) => {
  const { id } = req.params;
  const { comment_text } = req.body;
  const userId = req.user.id;

  if (!comment_text) {
    return res.status(400).json({ message: "Updated comment text is required." });
  }

  artworkCommentsModel.getCommentById(id, (err, result) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });
    if (!result.length) return res.status(404).json({ message: "Comment not found." });

    const comment = result[0];
    if (comment.author_id !== userId) return res.status(403).json({ message: "Forbidden: You can only edit your own comments." });

    artworkCommentsModel.updateComment(id, comment_text, (err2, result2) => {
      if (err2) return res.status(500).json({ message: "Database error.", error: err2 });
      if (result2.affectedRows === 0) return res.status(404).json({ message: "Comment not found or no changes made." });
      res.status(200).json({ message: "Comment updated successfully!" });
    });
  });
};

// Delete a comment
const deleteComment = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  artworkCommentsModel.getCommentById(id, (err, result) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });
    if (!result.length) return res.status(404).json({ message: "Comment not found." });

    const comment = result[0];
    if (comment.author_id !== userId) return res.status(403).json({ message: "Forbidden: You can only delete your own comments." });

    artworkCommentsModel.deleteComment(id, (err2, result2) => {
      if (err2) return res.status(500).json({ message: "Database error.", error: err2 });
      if (result2.affectedRows === 0) return res.status(404).json({ message: "Comment not found." });
      res.status(200).json({ message: "Comment deleted successfully!" });
    });
  });
};

// Get recent comments for artwork post
const getRecentCommentsByArtworkPostId = (req, res) => {
  const { artwork_post_id } = req.params;
  const limit = parseInt(req.query.limit) || 3;

  artworkCommentsModel.getRecentCommentsByArtworkPostId(artwork_post_id, limit, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });
    res.status(200).json(results);
  });
};

// Get comment count
const getCommentCount = (req, res) => {
  const { artwork_post_id } = req.params;

  artworkCommentsModel.getCommentCountByArtworkPostId(artwork_post_id, (err, count) => {
    if (err) return res.status(500).json({ message: "Failed to fetch comment count." });
    res.status(200).json({ count });
  });
};

module.exports = {
  createComment,
  getCommentsByArtworkPostId,
  getCommentById,
  updateComment,
  deleteComment,
  getCommentCount,
  getRecentCommentsByArtworkPostId,
};
