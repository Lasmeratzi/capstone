const messageModel = require("../models/messageModels");
const autoReplyModel = require("../models/autoReplyModels");

let io; // socket.io instance

// Attach socket.io to controller
const initSocket = (socketIoInstance) => {
  io = socketIoInstance;
};

// Send a message
const sendMessage = (req, res) => {
  const senderId = req.user.id;
  const { recipientId, message_text, portfolioItemId } = req.body;

  if (!recipientId || !message_text) {
    return res.status(400).json({ message: "Recipient and message text are required." });
  }

  // Save buyer's message
  messageModel.createMessage(
    senderId,
    recipientId,
    message_text,
    portfolioItemId || null, // ✅ include portfolioId if provided
    (err, result) => {
      if (err) return res.status(500).json({ message: "Database error.", error: err });

      const newMessage = {
        id: result.insertId,
        senderId,
        recipientId,
        text: message_text,
        portfolioId: portfolioItemId || null,
        timestamp: new Date(),
      };

      // Emit buyer’s message
      if (io) {
        io.to(senderId.toString()).emit("receiveMessage", newMessage);
        io.to(recipientId.toString()).emit("receiveMessage", newMessage);
      }

      // ✅ Auto-reply if portfolioItemId exists
      if (portfolioItemId) {
        autoReplyModel.getUserAutoReplyForItem(recipientId, portfolioItemId, (err2, results) => {
          if (!err2 && results.length > 0) {
            const autoReply = results[0].reply_text;

            // Save auto-reply message (from seller → buyer)
            messageModel.createMessage(
              recipientId,
              senderId,
              autoReply,
              portfolioItemId, // ✅ reply linked to same portfolio
              (err3, result2) => {
                if (!err3) {
                  const replyMessage = {
                    id: result2.insertId,
                    senderId: recipientId,
                    recipientId: senderId,
                    text: autoReply,
                    portfolioId: portfolioItemId,
                    timestamp: new Date(),
                  };

                  if (io) {
                    io.to(senderId.toString()).emit("receiveMessage", replyMessage);
                    io.to(recipientId.toString()).emit("receiveMessage", replyMessage);
                  }
                }
              }
            );
          }
        });
      }

      res.status(201).json({ message: "Message sent!", messageId: result.insertId });
    }
  );
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

  messageModel.markMessagesAsRead(userId, senderId, (err) => {
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
      return res
        .status(404)
        .json({ message: "Message not found or not authorized to delete." });
    }

    // Optionally broadcast deletion via socket.io
    if (io) {
      io.emit("messageDeleted", { messageId, userId });
    }

    res.status(200).json({ message: "Message deleted (soft)." });
  });
};

// Delete entire conversation
const deleteConversation = (req, res) => {
  const userId = req.user.id;
  const { otherUserId } = req.params;

  messageModel.deleteConversation(userId, otherUserId, (err, result) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Conversation not found." });
    }

    // Broadcast deletion
    if (io) {
      io.emit("conversationDeleted", { userId, otherUserId });
    }

    res.status(200).json({ message: "Conversation deleted (hard)." });
  });
};

// Get inbox based on following list
const getFollowingInbox = (req, res) => {
  const userId = req.user.id;
  const followModels = require("../models/followModels");

  followModels.getFollowing(userId, (err, followingList) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });

    if (!followingList.length) return res.status(200).json([]);

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
  initSocket,
  sendMessage,
  getConversation,
  getInbox,
  markMessagesAsRead,
  deleteMessage,
  getFollowingInbox,
  deleteConversation,
};
