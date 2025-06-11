const notificationsModels = require("../models/notificationsModels");

// Create notification (used internally, not an Express route)
const createNotification = (userId, message, callback) => {
  notificationsModels.createNotification(userId, message, callback);
};

// Express route handler to get notifications by userId
const getNotificationsByUserId = (req, res) => {
  const userId = req.params.userId;

  notificationsModels.getNotificationsByUserId(userId, (err, results) => {
    if (err) {
      console.error("Error fetching notifications:", err);
      return res.status(500).json({ message: "Failed to get notifications" });
    }
    res.json(results);
  });
};

// Express route handler to mark notification as read
const markNotificationAsRead = (req, res) => {
  const notificationId = req.params.notificationId;

  notificationsModels.markNotificationAsRead(notificationId, (err) => {
    if (err) {
      console.error("Error marking notification as read:", err);
      return res.status(500).json({ message: "Failed to mark notification as read" });
    }
    res.json({ message: "Notification marked as read" });
  });
};

// Express route handler to delete notification
const deleteNotification = (req, res) => {
  const notificationId = req.params.notificationId;

  notificationsModels.deleteNotification(notificationId, (err) => {
    if (err) {
      console.error("Error deleting notification:", err);
      return res.status(500).json({ message: "Failed to delete notification" });
    }
    res.json({ message: "Notification deleted successfully" });
  });
};

module.exports = {
  createNotification,
  getNotificationsByUserId,
  markNotificationAsRead,
  deleteNotification,
};
