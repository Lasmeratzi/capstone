const db = require("../config/database");

// Send message
const createMessage = (senderId, recipientId, message_text, callback) => {
  const sql = `
    INSERT INTO messages (sender_id, recipient_id, message_text, is_read)
    VALUES (?, ?, ?, 0)
  `;
  db.query(sql, [senderId, recipientId, message_text], callback);
};

// Get all messages with a specific user
const getConversation = (userId, recipientId, callback) => {
  const sql = `
    SELECT m.id, m.sender_id, m.recipient_id, m.message_text, m.created_at, m.is_read,
           u.username AS sender_username, u.pfp AS sender_pfp
    FROM messages m
    JOIN users u ON m.sender_id = u.id
    WHERE (m.sender_id = ? AND m.recipient_id = ?)
       OR (m.sender_id = ? AND m.recipient_id = ?)
    ORDER BY m.created_at ASC
  `;
  db.query(sql, [userId, recipientId, recipientId, userId], callback);
};

// Get inbox (latest message from each conversation)
const getInbox = (userId, callback) => {
  const sql = `
    SELECT m.id, m.sender_id, m.recipient_id, m.message_text, m.created_at, m.is_read,
           u.username AS sender_username, u.pfp AS sender_pfp,
           r.username AS recipient_username, r.pfp AS recipient_pfp
    FROM messages m
    JOIN users u ON m.sender_id = u.id
    JOIN users r ON m.recipient_id = r.id
    WHERE m.id IN (
      SELECT MAX(id) FROM messages
      WHERE sender_id = ? OR recipient_id = ?
      GROUP BY LEAST(sender_id, recipient_id), GREATEST(sender_id, recipient_id)
    )
    ORDER BY m.created_at DESC
  `;
  db.query(sql, [userId, userId], callback);
};

// Mark messages as read
const markMessagesAsRead = (userId, senderId, callback) => {
  const sql = `
    UPDATE messages
    SET is_read = 1
    WHERE sender_id = ? AND recipient_id = ? AND is_read = 0
  `;
  db.query(sql, [senderId, userId], callback);
};

// Delete message (only if user is the sender)
const deleteMessage = (userId, messageId, callback) => {
  const sql = `
    DELETE FROM messages
    WHERE id = ? AND sender_id = ?
  `;
  db.query(sql, [messageId, userId], callback);
};

// Get following list with latest message (for Instagram-style inbox)
const getFollowingInbox = (userId, callback) => {
  const sql = `
    SELECT u.id AS userId, u.username, u.pfp,
           m.message_text AS lastMessage,
           m.created_at AS lastMessageTime,
           IFNULL((
             SELECT COUNT(*) 
             FROM messages 
             WHERE sender_id = u.id AND recipient_id = ? AND is_read = 0
           ), 0) AS unreadCount
    FROM follows f
    JOIN users u ON f.following_id = u.id
    LEFT JOIN messages m ON (
      (m.sender_id = ? AND m.recipient_id = u.id)
      OR (m.sender_id = u.id AND m.recipient_id = ?)
    )
    AND m.id = (
      SELECT MAX(id) FROM messages
      WHERE (sender_id = ? AND recipient_id = u.id)
         OR (sender_id = u.id AND recipient_id = ?)
    )
    WHERE f.follower_id = ?
    ORDER BY m.created_at DESC
  `;
  db.query(sql, [userId, userId, userId, userId, userId, userId], callback);
};


module.exports = {
  createMessage,
  getConversation,
  getInbox,
  markMessagesAsRead,
  deleteMessage,
  getFollowingInbox, 
};
