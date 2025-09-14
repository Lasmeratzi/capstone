// models/autoReplyModels.js
const db = require("../config/database");

// Get auto-reply by portfolio item id
const getAutoReplyByItem = (portfolioItemId, callback) => {
  const sql = `SELECT * FROM auto_replies WHERE portfolio_item_id = ? LIMIT 1`;
  db.query(sql, [portfolioItemId], callback);
};

// Get auto-reply for a user's specific portfolio item
const getUserAutoReplyForItem = (userId, portfolioItemId, callback) => {
  const sql = `SELECT * FROM auto_replies WHERE user_id = ? AND portfolio_item_id = ? LIMIT 1`;
  db.query(sql, [userId, portfolioItemId], callback);
};

// Get all auto-replies belonging to a user
const getUserAutoReplies = (userId, callback) => {
  const sql = `
    SELECT ar.*, p.title AS portfolio_title, p.image_path
    FROM auto_replies ar
    LEFT JOIN portfolio_items p ON ar.portfolio_item_id = p.id
    WHERE ar.user_id = ?
    ORDER BY ar.updated_at DESC
  `;
  db.query(sql, [userId], callback);
};

// Create a new auto-reply
const createAutoReply = (userId, portfolioItemId, reply_text, callback) => {
  const sql = `
    INSERT INTO auto_replies (user_id, portfolio_item_id, reply_text)
    VALUES (?, ?, ?)
  `;
  db.query(sql, [userId, portfolioItemId, reply_text], callback);
};

// Update an existing auto-reply (by owner + portfolio item)
const updateAutoReply = (userId, portfolioItemId, reply_text, callback) => {
  const sql = `
    UPDATE auto_replies
    SET reply_text = ?, updated_at = NOW()
    WHERE user_id = ? AND portfolio_item_id = ?
  `;
  db.query(sql, [reply_text, userId, portfolioItemId], callback);
};

// Delete an auto-reply (owner only)
const deleteAutoReply = (userId, portfolioItemId, callback) => {
  const sql = `
    DELETE FROM auto_replies
    WHERE user_id = ? AND portfolio_item_id = ?
  `;
  db.query(sql, [userId, portfolioItemId], callback);
};

module.exports = {
  getAutoReplyByItem,
  getUserAutoReplyForItem,
  getUserAutoReplies,
  createAutoReply,
  updateAutoReply,
  deleteAutoReply,
};
