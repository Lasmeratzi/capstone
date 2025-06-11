const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const notificationsController = require("../controllers/notificationsController");

const router = express.Router();

// Create a notification (maybe system/admin or triggered elsewhere — secure it if needed)
router.post("/", authenticateToken, notificationsController.createNotification);

// Get notifications for logged-in user
router.get("/:userId", authenticateToken, notificationsController.getNotificationsByUserId);

// Mark a notification as read
router.put("/:notificationId/read", authenticateToken, notificationsController.markNotificationAsRead);

// Delete a notification
router.delete("/:notificationId", authenticateToken, notificationsController.deleteNotification);

module.exports = router;
