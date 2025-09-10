import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  withCredentials: true,
});

const Message = ({ otherUserId, refreshInbox }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [otherUser, setOtherUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const token = localStorage.getItem("token");
  const userId = parseInt(localStorage.getItem("id"));
  const messagesEndRef = useRef(null);

  // 👉 Fetch conversation history
  const fetchConversation = async () => {
    if (!otherUserId) return;
    try {
      const res = await axios.get(
        `http://localhost:5000/api/messages/${otherUserId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(res.data);

      // Mark as read + refresh inbox
      if (res.data.length > 0) {
        await axios.put(
          `http://localhost:5000/api/messages/read/${otherUserId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (refreshInbox) refreshInbox();
      }
    } catch (err) {
      console.error("Failed to fetch messages:", err.response?.data || err);
    }
  };

  // 👉 Fetch other user info
  const fetchOtherUser = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/profile/${otherUserId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOtherUser(res.data);
    } catch (err) {
      console.error("Failed to fetch other user:", err);
    }
  };

  // 👉 Fetch current user info
  const fetchCurrentUser = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentUser(res.data);
    } catch (err) {
      console.error("Failed to fetch current user:", err);
    }
  };

  // 👉 Setup sockets
  useEffect(() => {
    if (!userId) return;

    // Join user room
    socket.emit("join", userId);

    // Listen for incoming messages
    socket.on("receiveMessage", (msg) => {
      // Only update if it's from the current conversation
      if (
        msg.senderId === parseInt(otherUserId) ||
        msg.recipientId === parseInt(otherUserId)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
      if (refreshInbox) refreshInbox();
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [otherUserId, userId]);

  // 👉 Initial fetch
  useEffect(() => {
    fetchConversation();
    fetchOtherUser();
    fetchCurrentUser();
  }, [otherUserId]);

  // 👉 Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 👉 Send a message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      senderId: userId,
      recipientId: parseInt(otherUserId),
      text: newMessage,
    };

    try {
      // Save to DB
      await axios.post(
        "http://localhost:5000/api/messages",
        { recipientId: messageData.recipientId, message_text: messageData.text },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Emit real-time event
      socket.emit("sendMessage", messageData);

      setNewMessage("");
      setMessages((prev) => [
        ...prev,
        { sender_id: userId, message_text: newMessage, created_at: new Date() },
      ]);

      if (refreshInbox) refreshInbox();
    } catch (err) {
      console.error("Failed to send message:", err.response?.data || err);
    }
  };

  // 👉 Profile picture helper
  const getUserPfp = (senderId) => {
    if (senderId === userId) {
      return currentUser?.pfp
        ? `http://localhost:5000/uploads/${currentUser.pfp}`
        : "/default-avatar.png";
    } else {
      return otherUser?.pfp
        ? `http://localhost:5000/uploads/${otherUser.pfp}`
        : "/default-avatar.png";
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center mt-4">
            No messages yet. Say hi 👋
          </p>
        ) : (
          messages.map((msg, index) => {
            const isCurrentUser = msg.sender_id === userId || msg.senderId === userId;
            return (
              <div
                key={msg.id || index}
                className={`flex items-end gap-2 ${
                  isCurrentUser ? "justify-end" : "justify-start"
                }`}
              >
                {!isCurrentUser && (
                  <img
                    src={getUserPfp(msg.sender_id || msg.senderId)}
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover border border-gray-300"
                  />
                )}

                <div
                  className={`px-4 py-2 rounded-2xl max-w-xs shadow-sm ${
                    isCurrentUser
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  <p>{msg.message_text || msg.text}</p>
                  <p className="text-xs mt-1 text-gray-400 text-right">
                    {new Date(msg.created_at || msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                {isCurrentUser && (
                  <img
                    src={getUserPfp(msg.sender_id || msg.senderId)}
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover border border-gray-300"
                  />
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="p-3 border-t bg-white flex items-center gap-2"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full shadow"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Message;
