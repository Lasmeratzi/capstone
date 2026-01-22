const db = require("../config/database");

// Create notification - BACKWARD COMPATIBLE version
// Supports both old: (userId, message, callback) 
// AND new: (userId, senderId, type, message, relatedId, callback)
// Update createNotification for new format
const createNotification = (...args) => {
  const hasCallback = typeof args[args.length - 1] === 'function';
  const callback = hasCallback ? args.pop() : () => {};
  
  if (args.length === 2) {
    // OLDEST format: (userId, message) - for backward compatibility
    const [userId, message] = args;
    const query = "INSERT INTO notifications (user_id, message) VALUES (?, ?)";
    db.query(query, [userId, message], callback);
  } else if (args.length === 4) {
    // NEW SIMPLE format: (userId, senderId, type, message)
    const [userId, senderId, type, message] = args;
    const query = `
      INSERT INTO notifications 
      (user_id, sender_id, type, message) 
      VALUES (?, ?, ?, ?)
    `;
    db.query(query, [userId, senderId, type, message], callback);
  } else if (args.length === 6) {
    // FULL format: (userId, senderId, type, message, relatedId, relatedTable)
    const [userId, senderId, type, message, relatedId, relatedTable] = args;
    const query = `
      INSERT INTO notifications 
      (user_id, sender_id, type, message, related_id, related_table) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(query, [userId, senderId, type, message, relatedId, relatedTable], callback);
  } else {
    callback(new Error("Invalid arguments for createNotification"));
  }
};

// Get notifications by user with sender information
const getNotificationsByUserId = (userId, callback) => {
  const sql = `
    SELECT 
      n.*,
      u.username as sender_username,
      u.pfp as sender_pfp,
      u.fullname as sender_fullname
    FROM notifications n
    LEFT JOIN users u ON n.sender_id = u.id
    WHERE n.user_id = ?
    ORDER BY n.created_at DESC
  `;
  db.query(sql, [userId], callback);
};

// Mark notification as read
const markNotificationAsRead = (notificationId, callback) => {
  const sql = `
    UPDATE notifications
    SET is_read = true
    WHERE id = ?
  `;
  db.query(sql, [notificationId], callback);
};

// Mark all notifications as read for a user
const markAllAsRead = (userId, callback) => {
  const sql = `
    UPDATE notifications
    SET is_read = true
    WHERE user_id = ? AND is_read = false
  `;
  db.query(sql, [userId], callback);
};

const deleteNotification = (notificationId, callback) => {
  const sql = `
    DELETE FROM notifications
    WHERE id = ?
  `;
  db.query(sql, [notificationId], callback);
};

// Get unread notification count
const getUnreadCount = (userId, callback) => {
  const sql = `
    SELECT COUNT(*) as unread_count
    FROM notifications
    WHERE user_id = ? AND is_read = false
  `;
  db.query(sql, [userId], callback);
};

module.exports = {
  createNotification,
  getNotificationsByUserId,
  markNotificationAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
};