// controllers/autoReplyController.js
const db = require("../config/database");
const autoReplyModel = require("../models/autoReplyModels");

// Create auto reply (portfolio owner only)
const createAutoReply = (req, res) => {
  const userId = req.user.id;
  const { portfolioItemId, reply_text } = req.body;

  if (!portfolioItemId || !reply_text) {
    return res.status(400).json({ message: "portfolioItemId and reply_text are required." });
  }

  // Verify portfolio ownership
  db.query(
    "SELECT user_id FROM portfolio_items WHERE id = ?",
    [portfolioItemId],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Database error.", error: err });
      if (!results.length) return res.status(404).json({ message: "Portfolio item not found." });

      const ownerId = results[0].user_id;
      if (ownerId !== userId) {
        return res.status(403).json({ message: "Not authorized to create auto reply for this item." });
      }

      // Try creating (unique constraint prevents duplicates)
      autoReplyModel.createAutoReply(userId, portfolioItemId, reply_text, (err, result) => {
        if (err) {
          // handle duplicate key gracefully
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ message: "Auto-reply already exists for this item. Use update instead." });
          }
          return res.status(500).json({ message: "Database error.", error: err });
        }
        res.status(201).json({ message: "Auto-reply created.", id: result.insertId });
      });
    }
  );
};

// Update an auto-reply (owner only)
const updateAutoReply = (req, res) => {
  const userId = req.user.id;
  const { portfolioItemId } = req.params;
  const { reply_text } = req.body;

  if (!reply_text) return res.status(400).json({ message: "reply_text is required." });

  // Verify ownership first
  db.query("SELECT user_id FROM portfolio_items WHERE id = ?", [portfolioItemId], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });
    if (!results.length) return res.status(404).json({ message: "Portfolio item not found." });
    if (results[0].user_id !== userId) return res.status(403).json({ message: "Not authorized." });

    autoReplyModel.updateAutoReply(userId, portfolioItemId, reply_text, (err, result) => {
      if (err) return res.status(500).json({ message: "Database error.", error: err });
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Auto-reply not found for this item." });
      }
      res.status(200).json({ message: "Auto-reply updated." });
    });
  });
};

// Delete auto-reply (owner only)
const deleteAutoReply = (req, res) => {
  const userId = req.user.id;
  const { portfolioItemId } = req.params;

  // Verify ownership
  db.query("SELECT user_id FROM portfolio_items WHERE id = ?", [portfolioItemId], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });
    if (!results.length) return res.status(404).json({ message: "Portfolio item not found." });
    if (results[0].user_id !== userId) return res.status(403).json({ message: "Not authorized." });

    autoReplyModel.deleteAutoReply(userId, portfolioItemId, (err, result) => {
      if (err) return res.status(500).json({ message: "Database error.", error: err });
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Auto-reply not found." });
      }
      res.status(200).json({ message: "Auto-reply deleted." });
    });
  });
};

// Get auto-reply for a portfolio item (used by visitor when inquiring)
const getAutoReplyByItem = (req, res) => {
  const { portfolioItemId } = req.params;

  autoReplyModel.getAutoReplyByItem(portfolioItemId, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });
    if (!results.length) return res.status(200).json(null); // no auto-reply
    res.status(200).json(results[0]);
  });
};

// List all auto replies for current user
const getUserAutoReplies = (req, res) => {
  const userId = req.user.id;
  autoReplyModel.getUserAutoReplies(userId, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });
    res.status(200).json(results);
  });
};

module.exports = {
  createAutoReply,
  updateAutoReply,
  deleteAutoReply,
  getAutoReplyByItem,
  getUserAutoReplies,
};
