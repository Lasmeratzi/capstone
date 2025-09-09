import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const Message = ({ otherUserId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("id"); // Logged-in user ID
  const messagesEndRef = useRef(null);

  // Fetch conversation
  const fetchConversation = async () => {
    if (!otherUserId) return;
    try {
      const res = await axios.get(
        `http://localhost:5000/api/messages/${otherUserId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };

  useEffect(() => {
    fetchConversation();
  }, [otherUserId]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send a message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    if (!otherUserId) {
      console.error("No recipient selected!");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/messages",
        { recipientId: parseInt(otherUserId), message_text: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewMessage("");
      fetchConversation(); // Refresh messages
    } catch (err) {
      console.error("Failed to send message:", err.response?.data || err);
    }
  };

  return (
    <div className="flex flex-col h-full border rounded-lg bg-gray-50 shadow-sm">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center mt-4">No messages yet. Say hi 👋</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender_id == userId ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-xs ${
                  msg.sender_id == userId
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg.message_text}
                <p className="text-xs mt-1 text-gray-400">
                  {new Date(msg.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 border-t flex items-center gap-2 bg-white">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded-full px-4 py-2 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Message;
