const messageModel = require("../models/messageModels");

// Send a message
const sendMessage = (req, res) => {
  const senderId = req.user.id;
  const { recipientId, message_text } = req.body; // match frontend

  if (!recipientId || !message_text) {
    return res.status(400).json({ message: "Recipient and message text are required." });
  }

  messageModel.createMessage(senderId, recipientId, message_text, (err, result) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });
    res.status(201).json({ message: "Message sent!", messageId: result.insertId });
  });
};



// Get all messages with a specific user
const getConversation = (req, res) => {
  const userId = req.user.id;
  const { recipientId } = req.params;

  messageModel.getConversation(userId, recipientId, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });
    res.status(200).json(results);
  });
};

// Get inbox (latest message from each conversation)
const getInbox = (req, res) => {
  const userId = req.user.id;

  messageModel.getInbox(userId, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });
    res.status(200).json(results);
  });
};

// Mark all messages from a specific sender as read
const markMessagesAsRead = (req, res) => {
  const userId = req.user.id;
  const { senderId } = req.params;

  messageModel.markMessagesAsRead(userId, senderId, (err, result) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });
    res.status(200).json({ message: "Messages marked as read." });
  });
};

// Delete a specific message (only if sender is the logged-in user)
const deleteMessage = (req, res) => {
  const userId = req.user.id;
  const { messageId } = req.params;

  messageModel.deleteMessage(userId, messageId, (err, result) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Message not found or not authorized to delete." });
    }
    res.status(200).json({ message: "Message deleted successfully." });
  });
};

// Get inbox based on following list
const getFollowingInbox = (req, res) => {
  const userId = req.user.id;

  // Step 1: Get the list of users this user follows
  const followModels = require("../models/followModels");
  followModels.getFollowing(userId, (err, followingList) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });

    if (!followingList.length) return res.status(200).json([]);

    const messageModel = require("../models/messageModels");
    const inboxPromises = followingList.map((followedUser) => {
      return new Promise((resolve, reject) => {
        messageModel.getConversation(userId, followedUser.id, (err, messages) => {
          if (err) return reject(err);

          const lastMessage = messages[messages.length - 1];
          const unreadCount = messages.filter(
            (m) => m.sender_id === followedUser.id && !m.is_read
          ).length;

          resolve({
            userId: followedUser.id,
            username: followedUser.username,
            pfp: followedUser.pfp,
            lastMessage: lastMessage ? lastMessage.message_text : null,
            lastMessageTime: lastMessage ? lastMessage.created_at : null,
            unreadCount,
          });
        });
      });
    });

    Promise.all(inboxPromises)
      .then((inboxData) => res.status(200).json(inboxData))
      .catch((err) => res.status(500).json({ message: "Database error.", error: err }));
  });
};



module.exports = {
  sendMessage,
  getConversation,
  getInbox,
  markMessagesAsRead,
  deleteMessage,
  getFollowingInbox,
};
