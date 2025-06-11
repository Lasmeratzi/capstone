const db = require("../config/database");

// Create notification

const createNotification = (userId, message, callback = () => {}) => {
  const query = "INSERT INTO notifications (user_id, message) VALUES (?, ?)";
  db.query(query, [userId, message], callback);
};

// Get notifications by user
const getNotificationsByUserId = (userId, callback) => {
  const sql = `
    SELECT * FROM notifications
    WHERE user_id = ?
    ORDER BY created_at DESC
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

const deleteNotification = (notificationId, callback) => {
  const sql = `
    DELETE FROM notifications
    WHERE id = ?
  `;
  db.query(sql, [notificationId], callback);
};

module.exports = {
  createNotification,
  getNotificationsByUserId,
  markNotificationAsRead,
  deleteNotification,
};
