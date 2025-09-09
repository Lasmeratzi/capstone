const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const messageController = require("../controllers/messageController");

const router = express.Router();

// Inbox of all conversations
router.get("/inbox", authenticateToken, messageController.getInbox);

// Inbox of following users only (Instagram-style)
router.get("/following-inbox", authenticateToken, messageController.getFollowingInbox);

// Conversation with a specific user
router.get("/:recipientId", authenticateToken, messageController.getConversation);

// Send a message
router.post("/", authenticateToken, messageController.sendMessage);

// Mark messages as read
router.put("/read/:senderId", authenticateToken, messageController.markMessagesAsRead);

// Delete a message
router.delete("/:messageId", authenticateToken, messageController.deleteMessage);

module.exports = router;
