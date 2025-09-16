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
  const [confirmDeleteConversation, setConfirmDeleteConversation] =
    useState(false);

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
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <img
            src={
              otherUser?.pfp
                ? `http://localhost:5000/uploads/${otherUser.pfp}`
                : "/default-avatar.png"
            }
            alt="avatar"
            className="w-12 h-12 rounded-full object-cover border border-gray-300"
          />
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {otherUser ? otherUser.username : "Loading..."}
            </h2>
            <p className="text-sm text-gray-500">
              {otherUser ? otherUser.fullname : ""}
            </p>
          </div>
        </div>

        {/* Header 3-dot menu */}
        <div className="relative">
          <button
            onClick={() => setShowHeaderMenu(!showHeaderMenu)}
            className="text-gray-600 hover:text-gray-800 px-2 text-xl"
          >
            ⋮
          </button>
          {showHeaderMenu && (
            <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg z-10">
              <button
                onClick={() => {
                  setShowHeaderMenu(false);
                  setConfirmDeleteConversation(true);
                }}
                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 rounded-md transition"
              >
                Delete Conversation
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center mt-4">
            No messages yet. Say hi 👋
          </p>
        ) : (
          messages.map((msg, index) => {
            const isCurrentUser =
              msg.sender_id === userId || msg.senderId === userId;
            const isDeleted =
              (msg.message_text || msg.text) === "message deleted";
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

                <div className="flex items-center gap-1 relative max-w-xs group">
                  {/* Three-dot menu */}
                  {isCurrentUser && !isDeleted && (
                    <div className="relative">
                      <button
                        onClick={() =>
                          setShowMenu(showMenu === msg.id ? null : msg.id)
                        }
                        className="text-gray-500 hover:text-gray-700 px-2"
                      >
                        ⋮
                      </button>
                      {showMenu === msg.id && (
                        <div className="absolute left-0 mt-2 w-28 bg-white border rounded-lg shadow-md z-10">
                          <button
                            onClick={() => {
                              setShowMenu(null);
                              setConfirmDelete(msg.id);
                            }}
                            className="block w-full text-left px-3 py-1 text-red-600 hover:bg-gray-100 rounded-md transition"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Message bubble with hover timestamp */}
                  <div
                    className={`relative px-4 py-2 rounded-2xl shadow-sm ${
                      isDeleted
                        ? "bg-transparent border border-gray-400 text-gray-500 italic text-center"
                        : isCurrentUser
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    <p>{msg.message_text || msg.text}</p>

                    {/* Timestamp tooltip */}
                    {!isDeleted && (
                      <span
                        className={`absolute hidden group-hover:block text-[11px] px-2 py-1 rounded bg-gray-700 text-white shadow-md transition-opacity duration-200 ${
                          isCurrentUser ? "right-0 -bottom-6" : "left-0 -bottom-6"
                        }`}
                      >
                        {new Date(
                          msg.created_at || msg.timestamp
                        ).toLocaleTimeString([], {
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

      {/* Delete message confirmation modal */}
      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-20">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-sm">
            <p className="mb-4 text-gray-700">
              Are you sure you want to delete this message?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteMessage(confirmDelete)}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 shadow-sm transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete conversation confirmation modal */}
      {confirmDeleteConversation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-20">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-sm">
            <p className="mb-4 text-gray-700">
              Are you sure you want to delete this entire conversation?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setConfirmDeleteConversation(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConversation}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 shadow-sm transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Message;
