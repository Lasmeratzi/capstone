// models/autoReplyModels.js
const db = require("../config/database");

// ========== NEW FUNCTIONS WITH INQUIRY TYPE ==========

// Get auto-reply by portfolio item id AND type
const getAutoReplyByItemAndType = (portfolioItemId, inquiryType, callback) => {
  const sql = `SELECT * FROM auto_replies WHERE portfolio_item_id = ? AND inquiry_type = ? LIMIT 1`;
  db.query(sql, [portfolioItemId, inquiryType], callback);
};

// Get auto-reply for a user's specific portfolio item and type
const getUserAutoReplyForItemAndType = (userId, portfolioItemId, inquiryType, callback) => {
  const sql = `SELECT * FROM auto_replies WHERE user_id = ? AND portfolio_item_id = ? AND inquiry_type = ? LIMIT 1`;
  db.query(sql, [userId, portfolioItemId, inquiryType], callback);
};

// Get all auto-replies for a portfolio item (all 3 types)
const getAutoRepliesByItem = (portfolioItemId, callback) => {
  const sql = `SELECT * FROM auto_replies WHERE portfolio_item_id = ? ORDER BY 
    CASE inquiry_type 
      WHEN 'price' THEN 1 
      WHEN 'availability' THEN 2 
      WHEN 'contact' THEN 3 
      ELSE 4 
    END`;
  db.query(sql, [portfolioItemId], callback);
};

// Create a new auto-reply with type
const createAutoReply = (userId, portfolioItemId, reply_text, inquiry_type = 'price', callback) => {
  const sql = `
    INSERT INTO auto_replies (user_id, portfolio_item_id, reply_text, inquiry_type)
    VALUES (?, ?, ?, ?)
  `;
  db.query(sql, [userId, portfolioItemId, reply_text, inquiry_type], callback);
};

// Update an existing auto-reply (by owner + portfolio item + type)
const updateAutoReply = (userId, portfolioItemId, reply_text, inquiry_type = 'price', callback) => {
  const sql = `
    UPDATE auto_replies
    SET reply_text = ?, updated_at = NOW()
    WHERE user_id = ? AND portfolio_item_id = ? AND inquiry_type = ?
  `;
  db.query(sql, [reply_text, userId, portfolioItemId, inquiry_type], callback);
};

// Delete an auto-reply (owner only) - specific type
const deleteAutoReply = (userId, portfolioItemId, inquiry_type = 'price', callback) => {
  const sql = `
    DELETE FROM auto_replies
    WHERE user_id = ? AND portfolio_item_id = ? AND inquiry_type = ?
  `;
  db.query(sql, [userId, portfolioItemId, inquiry_type], callback);
};

// Delete ALL auto-replies for a portfolio item
const deleteAllAutoRepliesForItem = (userId, portfolioItemId, callback) => {
  const sql = `
    DELETE FROM auto_replies
    WHERE user_id = ? AND portfolio_item_id = ?
  `;
  db.query(sql, [userId, portfolioItemId], callback);
};

// ========== OLD FUNCTIONS (for backward compatibility) ==========

// Get auto-reply by portfolio item id (defaults to 'price' type for compatibility)
const getAutoReplyByItem = (portfolioItemId, callback) => {
  const sql = `SELECT * FROM auto_replies WHERE portfolio_item_id = ? AND inquiry_type = 'price' LIMIT 1`;
  db.query(sql, [portfolioItemId], callback);
};

// Get auto-reply for a user's specific portfolio item (defaults to 'price' type)
const getUserAutoReplyForItem = (userId, portfolioItemId, callback) => {
  const sql = `SELECT * FROM auto_replies WHERE user_id = ? AND portfolio_item_id = ? AND inquiry_type = 'price' LIMIT 1`;
  db.query(sql, [userId, portfolioItemId], callback);
};

// Get all auto-replies belonging to a user (updated to show all types)
const getUserAutoReplies = (userId, callback) => {
  const sql = `
    SELECT ar.*, p.title AS portfolio_title, p.image_path
    FROM auto_replies ar
    LEFT JOIN portfolio_items p ON ar.portfolio_item_id = p.id
    WHERE ar.user_id = ?
    ORDER BY ar.portfolio_item_id, 
      CASE ar.inquiry_type 
        WHEN 'price' THEN 1 
        WHEN 'availability' THEN 2 
        WHEN 'contact' THEN 3 
        ELSE 4 
      END
  `;
  db.query(sql, [userId], callback);
};

module.exports = {
  // New functions with type support
  getAutoReplyByItemAndType,
  getUserAutoReplyForItemAndType,
  getAutoRepliesByItem,
  createAutoReply,
  updateAutoReply,
  deleteAutoReply,
  deleteAllAutoRepliesForItem,
  
  // Old functions for backward compatibility
  getAutoReplyByItem,
  getUserAutoReplyForItem,
  getUserAutoReplies,
};

