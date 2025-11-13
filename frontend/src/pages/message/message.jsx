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
  const [showMenu, setShowMenu] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showHeaderMenu, setShowHeaderMenu] = useState(false);
  const [confirmDeleteConversation, setConfirmDeleteConversation] = useState(false);

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

  // 👉 Fetch profiles
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

    socket.emit("join", userId);

    socket.on("receiveMessage", (msg) => {
      if (
        msg.senderId === parseInt(otherUserId) ||
        msg.recipientId === parseInt(otherUserId)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
      if (refreshInbox) refreshInbox();
    });

    socket.on("messageDeleted", ({ messageId }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId ? { ...m, message_text: "message deleted" } : m
        )
      );
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("messageDeleted");
    };
  }, [otherUserId, userId]);

  useEffect(() => {
    fetchConversation();
    fetchOtherUser();
    fetchCurrentUser();
  }, [otherUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 👉 Send message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      senderId: userId,
      recipientId: parseInt(otherUserId),
      text: newMessage,
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/api/messages",
        { recipientId: messageData.recipientId, message_text: messageData.text },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      socket.emit("sendMessage", {
        ...messageData,
        id: res.data.id,
      });

      setNewMessage("");
      setMessages((prev) => [
        ...prev,
        {
          id: res.data.id,
          sender_id: userId,
          message_text: newMessage,
          created_at: new Date(),
        },
      ]);

      if (refreshInbox) refreshInbox();
    } catch (err) {
      console.error("Failed to send message:", err.response?.data || err);
    }
  };

  // 👉 Delete a message
  const handleDeleteMessage = async (messageId) => {
    try {
      await axios.delete(`http://localhost:5000/api/messages/${messageId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId ? { ...m, message_text: "message deleted" } : m
        )
      );

      socket.emit("deleteMessage", { messageId });
    } catch (err) {
      console.error("Failed to delete message:", err.response?.data || err);
    }
    setConfirmDelete(null);
  };

  // 👉 Delete conversation
  const handleDeleteConversation = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/messages/conversation/${otherUserId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages([]);
      if (refreshInbox) refreshInbox();
    } catch (err) {
      console.error("Failed to delete conversation:", err.response?.data || err);
    }
    setConfirmDeleteConversation(false);
  };

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
    <div className="flex flex-col h-full bg-white border-l border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-4">
          <img
            src={
              otherUser?.pfp
                ? `http://localhost:5000/uploads/${otherUser.pfp}`
                : "/default-avatar.png"
            }
            alt="avatar"
            className="w-14 h-14 rounded-full object-cover border-2 border-gray-200 shadow-sm"
          />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {otherUser ? otherUser.username : "Loading..."}
            </h2>
            <p className="text-sm text-gray-500 font-medium">
              {otherUser ? otherUser.fullname : ""}
            </p>
          </div>
        </div>

        {/* Header menu */}
        <div className="relative">
          <button
            onClick={() => setShowHeaderMenu(!showHeaderMenu)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
          {showHeaderMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-10 py-2">
              <button
                onClick={() => {
                  setShowHeaderMenu(false);
                  setConfirmDeleteConversation(true);
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Conversation
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-lg font-medium text-gray-500">No messages yet</p>
            <p className="text-sm text-gray-400">Say hi to start the conversation 👋</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isCurrentUser = msg.sender_id === userId || msg.senderId === userId;
            const isDeleted = (msg.message_text || msg.text) === "message deleted";
            
            return (
              <div
                key={msg.id || index}
                className={`flex items-start gap-3 ${isCurrentUser ? "justify-end" : "justify-start"}`}
              >
                {!isCurrentUser && (
                  <img
                    src={getUserPfp(msg.sender_id || msg.senderId)}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover border border-gray-300 mt-1"
                  />
                )}

                <div className={`flex flex-col ${isCurrentUser ? "items-end" : "items-start"} max-w-xs`}>
                  <div className="flex items-center gap-2">
                    {!isCurrentUser && (
                      <span className="text-xs text-gray-500 font-medium">
                        {otherUser?.username}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-end gap-2 group relative">
                    {isCurrentUser && !isDeleted && (
                      <div className="relative">
                        <button
                          onClick={() => setShowMenu(showMenu === msg.id ? null : msg.id)}
                          className="p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>
                        {showMenu === msg.id && (
                          <div className="absolute left-0 bottom-full mb-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1">
                            <button
                              onClick={() => {
                                setShowMenu(null);
                                setConfirmDelete(msg.id);
                              }}
                              className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    <div
                      className={`px-4 py-3 rounded-2xl shadow-sm ${
                        isDeleted
                          ? "bg-gray-100 border border-gray-300 text-gray-500 italic text-center"
                          : isCurrentUser
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-800 border border-gray-200"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.message_text || msg.text}</p>
                    </div>

                    {/* Timestamp */}
                    {!isDeleted && (
                      <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                        {new Date(msg.created_at || msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    )}
                  </div>
                </div>

                {isCurrentUser && (
                  <img
                    src={getUserPfp(msg.sender_id || msg.senderId)}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover border border-gray-300 mt-1"
                  />
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 border-t border-gray-100 bg-white">
        <form onSubmit={handleSend} className="flex items-center gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-full px-6 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-full shadow-sm hover:shadow-md transition-all duration-200 font-medium"
          >
            Send
          </button>
        </form>
      </div>

      {/* Delete message confirmation modal */}
      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Message</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to delete this message? This action cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteMessage(confirmDelete)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete conversation confirmation modal */}
      {confirmDeleteConversation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Conversation</h3>
              <p className="text-gray-600 mb-6">This will permanently delete all messages in this conversation. This action cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDeleteConversation(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConversation}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Message;