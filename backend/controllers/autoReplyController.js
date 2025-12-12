// controllers/autoReplyController.js
const db = require("../config/database");
const autoReplyModel = require("../models/autoReplyModels");

// Create auto reply (portfolio owner only) - NOW WITH TYPE
const createAutoReply = (req, res) => {
  const userId = req.user.id;
  const { portfolioItemId, reply_text, inquiry_type = 'price' } = req.body;

  if (!portfolioItemId || !reply_text) {
    return res.status(400).json({ message: "portfolioItemId and reply_text are required." });
  }

  // Validate inquiry type
  if (!['price', 'availability', 'contact'].includes(inquiry_type)) {
    return res.status(400).json({ message: "Invalid inquiry_type. Must be 'price', 'availability', or 'contact'." });
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

      // Try creating (unique constraint prevents duplicates for same type)
      autoReplyModel.createAutoReply(userId, portfolioItemId, reply_text, inquiry_type, (err, result) => {
        if (err) {
          // handle duplicate key gracefully
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ 
              message: `Auto-reply of type '${inquiry_type}' already exists for this item. Use update instead.` 
            });
          }
          return res.status(500).json({ message: "Database error.", error: err });
        }
        res.status(201).json({ 
          message: `Auto-reply (${inquiry_type}) created.`, 
          id: result.insertId,
          inquiry_type 
        });
      });
    }
  );
};

// Update an auto-reply (owner only) - NOW WITH TYPE
const updateAutoReply = (req, res) => {
  const userId = req.user.id;
  const { portfolioItemId } = req.params;
  const { reply_text, inquiry_type = 'price' } = req.body;

  if (!reply_text) return res.status(400).json({ message: "reply_text is required." });

  // Validate inquiry type
  if (!['price', 'availability', 'contact'].includes(inquiry_type)) {
    return res.status(400).json({ message: "Invalid inquiry_type. Must be 'price', 'availability', or 'contact'." });
  }

  // Verify ownership first
  db.query("SELECT user_id FROM portfolio_items WHERE id = ?", [portfolioItemId], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });
    if (!results.length) return res.status(404).json({ message: "Portfolio item not found." });
    if (results[0].user_id !== userId) return res.status(403).json({ message: "Not authorized." });

    autoReplyModel.updateAutoReply(userId, portfolioItemId, reply_text, inquiry_type, (err, result) => {
      if (err) return res.status(500).json({ message: "Database error.", error: err });
      if (result.affectedRows === 0) {
        return res.status(404).json({ 
          message: `Auto-reply of type '${inquiry_type}' not found for this item.` 
        });
      }
      res.status(200).json({ message: `Auto-reply (${inquiry_type}) updated.` });
    });
  });
};

// Delete auto-reply (owner only) - NOW WITH TYPE
const deleteAutoReply = (req, res) => {
  const userId = req.user.id;
  const { portfolioItemId } = req.params;
  const { inquiry_type = 'price' } = req.body; // Get type from body or default to price

  // Validate inquiry type
  if (!['price', 'availability', 'contact'].includes(inquiry_type)) {
    return res.status(400).json({ message: "Invalid inquiry_type. Must be 'price', 'availability', or 'contact'." });
  }

  // Verify ownership
  db.query("SELECT user_id FROM portfolio_items WHERE id = ?", [portfolioItemId], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });
    if (!results.length) return res.status(404).json({ message: "Portfolio item not found." });
    if (results[0].user_id !== userId) return res.status(403).json({ message: "Not authorized." });

    autoReplyModel.deleteAutoReply(userId, portfolioItemId, inquiry_type, (err, result) => {
      if (err) return res.status(500).json({ message: "Database error.", error: err });
      if (result.affectedRows === 0) {
        return res.status(404).json({ 
          message: `Auto-reply of type '${inquiry_type}' not found.` 
        });
      }
      res.status(200).json({ message: `Auto-reply (${inquiry_type}) deleted.` });
    });
  });
};

// Get auto-reply for a portfolio item (used by visitor when inquiring) - NOW WITH TYPE
const getAutoReplyByItem = (req, res) => {
  const { portfolioItemId } = req.params;
  const { inquiry_type = 'price' } = req.query; // Get type from query params

  // Validate inquiry type if provided
  if (inquiry_type && !['price', 'availability', 'contact'].includes(inquiry_type)) {
    return res.status(400).json({ message: "Invalid inquiry_type. Must be 'price', 'availability', or 'contact'." });
  }

  if (inquiry_type) {
    // Get specific type
    autoReplyModel.getAutoReplyByItemAndType(portfolioItemId, inquiry_type, (err, results) => {
      if (err) return res.status(500).json({ message: "Database error.", error: err });
      if (!results.length) return res.status(200).json(null); // no auto-reply of this type
      res.status(200).json(results[0]);
    });
  } else {
    // Get all types for this item
    autoReplyModel.getAutoRepliesByItem(portfolioItemId, (err, results) => {
      if (err) return res.status(500).json({ message: "Database error.", error: err });
      if (!results.length) return res.status(200).json([]); // no auto-replies at all
      res.status(200).json(results);
    });
  }
};

// List all auto replies for current user
const getUserAutoReplies = (req, res) => {
  const userId = req.user.id;
  autoReplyModel.getUserAutoReplies(userId, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });
    res.status(200).json(results);
  });
};

// NEW: Get all auto-replies for a specific portfolio item (owner only)
const getPortfolioItemAutoReplies = (req, res) => {
  const userId = req.user.id;
  const { portfolioItemId } = req.params;

  // Verify ownership
  db.query("SELECT user_id FROM portfolio_items WHERE id = ?", [portfolioItemId], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });
    if (!results.length) return res.status(404).json({ message: "Portfolio item not found." });
    if (results[0].user_id !== userId) return res.status(403).json({ message: "Not authorized." });

    // Get all auto-reply types for this item
    autoReplyModel.getAutoRepliesByItem(portfolioItemId, (err, results) => {
      if (err) return res.status(500).json({ message: "Database error.", error: err });
      res.status(200).json(results);
    });
  });
};

// NEW: Batch update auto-replies for a portfolio item
const batchUpdateAutoReplies = (req, res) => {
  const userId = req.user.id;
  const { portfolioItemId } = req.params;
  const { autoReplies } = req.body; // Expected format: { price: "text", availability: "text", contact: "text" }

  if (!autoReplies || typeof autoReplies !== 'object') {
    return res.status(400).json({ message: "autoReplies object is required." });
  }

  // Verify ownership
  db.query("SELECT user_id FROM portfolio_items WHERE id = ?", [portfolioItemId], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });
    if (!results.length) return res.status(404).json({ message: "Portfolio item not found." });
    if (results[0].user_id !== userId) return res.status(403).json({ message: "Not authorized." });

    const updates = [];
    const validTypes = ['price', 'availability', 'contact'];
    
    // Process each auto-reply type
    validTypes.forEach(type => {
      if (autoReplies[type] !== undefined) {
        updates.push(
          new Promise((resolve, reject) => {
            // Check if auto-reply exists for this type
            autoReplyModel.getUserAutoReplyForItemAndType(
              userId, 
              portfolioItemId, 
              type, 
              (err, existing) => {
                if (err) return reject(err);
                
                if (existing.length > 0) {
                  // Update existing
                  autoReplyModel.updateAutoReply(
                    userId, 
                    portfolioItemId, 
                    autoReplies[type], 
                    type, 
                    (err, result) => {
                      if (err) reject(err);
                      else resolve({ type, action: 'updated' });
                    }
                  );
                } else {
                  // Create new
                  autoReplyModel.createAutoReply(
                    userId, 
                    portfolioItemId, 
                    autoReplies[type], 
                    type, 
                    (err, result) => {
                      if (err) reject(err);
                      else resolve({ type, action: 'created' });
                    }
                  );
                }
              }
            );
          })
        );
      }
    });

    // Wait for all updates to complete
    Promise.all(updates)
      .then(results => {
        res.status(200).json({ 
          message: "Auto-replies updated successfully.", 
          results 
        });
      })
      .catch(err => {
        res.status(500).json({ message: "Database error.", error: err });
      });
  });
};

module.exports = {
  createAutoReply,
  updateAutoReply,
  deleteAutoReply,
  getAutoReplyByItem,
  getUserAutoReplies,
  getPortfolioItemAutoReplies, // NEW
  batchUpdateAutoReplies,      // NEW
};