import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../sidebar/sidebar";
import Message from "../message/message";

const Inbox = () => {
  const [followingList, setFollowingList] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("token");
  const currentUserId = parseInt(localStorage.getItem("id"));

  // ✅ Fetch inbox list
  const fetchFollowingInbox = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/messages/following-inbox",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFollowingList(res.data);
    } catch (err) {
      console.error("Failed to fetch inbox:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchFollowingInbox();
  }, [token]);

  const handleUserClick = (userId) => {
    setSelectedUserId(userId);
    fetchFollowingInbox();
  };

  const filteredList = followingList.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.fullname?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to format the last message preview
  const formatLastMessage = (user) => {
    if (!user.lastMessage) return "No messages yet";
    
    // Check if the last message was sent by the current user
    // If lastMessageSenderId matches currentUserId, show "You:"
    if (user.lastMessageSenderId === currentUserId) {
      return "You: " + user.lastMessage;
    } else {
      // Otherwise show the other user's username
      return user.username + ": " + user.lastMessage;
    }
  };

  const UserCard = ({ user }) => (
    <li
      onClick={() => handleUserClick(user.userId)}
      className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-200 border border-transparent hover:border-gray-200 hover:bg-white hover:shadow-sm ${
        selectedUserId === user.userId 
          ? "bg-white border-blue-200 shadow-sm" 
          : "bg-gray-50"
      }`}
    >
      <div className="relative">
        <img
          src={
            user.pfp
              ? `http://localhost:5000/uploads/${user.pfp}`
              : "/default-avatar.png"
          }
          alt={user.username}
          className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
        />
        {user.unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-medium w-6 h-6 rounded-full flex items-center justify-center shadow-sm">
            {user.unreadCount > 99 ? "99+" : user.unreadCount}
          </span>
        )}
      </div>
      
      <div className="flex-1 min-w-0 ml-4">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-gray-900 truncate">{user.username}</p>
          {user.lastMessageTime && (
            <p className="text-xs text-gray-500 font-medium whitespace-nowrap ml-2">
              {new Date(user.lastMessageTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          )}
        </div>
        
        {user.fullname && (
          <p className="text-sm text-gray-600 truncate">{user.fullname}</p>
        )}
        
        <p className={`text-sm truncate mt-1 ${
          user.unreadCount > 0 ? "text-gray-900 font-medium" : "text-gray-500"
        }`}>
          {formatLastMessage(user)}
        </p>
      </div>
    </li>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - removed fixed positioning to eliminate gap */}
      <div className="flex-shrink-0">
        <Sidebar />
      </div>

      {/* Left panel: Inbox list - removed ml-64 to eliminate gap */}
      <div className="w-96 border-r border-gray-200 bg-white flex flex-col shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Messages</h2>
          <p className="text-sm text-gray-600">Chat with people you follow</p>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Conversations list */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-gray-500 mt-3 text-sm">Loading conversations...</p>
            </div>
          ) : filteredList.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-400">
              <svg className="w-12 h-12 mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-sm text-center px-6">
                {searchTerm ? "No conversations found" : "You are not following anyone yet"}
              </p>
            </div>
          ) : (
            <ul className="p-4 space-y-2">
              {filteredList.map((user) => (
                <UserCard key={user.userId} user={user} />
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Right panel: Chat window */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedUserId ? (
          <Message
            otherUserId={selectedUserId}
            refreshInbox={fetchFollowingInbox}
          />
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 text-gray-400 p-8">
            <svg className="w-24 h-24 mb-6 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-500 mb-2">Select a conversation</h3>
            <p className="text-sm text-gray-400 text-center max-w-md">
              Choose a conversation from the list to start messaging or search for someone you follow.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inbox;