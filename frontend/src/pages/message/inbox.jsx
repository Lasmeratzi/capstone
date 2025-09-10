import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../sidebar/sidebar";
import Message from "../message/message";

const Inbox = () => {
  const [followingList, setFollowingList] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

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
    fetchFollowingInbox(); // refresh right when user clicks
  };

  const UserCard = ({ user }) => (
    <li
      onClick={() => handleUserClick(user.userId)}
      className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition ${
        selectedUserId === user.userId ? "bg-gray-200" : ""
      }`}
    >
      <img
        src={
          user.pfp
            ? `http://localhost:5000/uploads/${user.pfp}`
            : "/default-avatar.png"
        }
        alt={user.username}
        className="w-12 h-12 rounded-full object-cover border border-gray-300"
      />
      <div className="flex-1 min-w-0 ml-3">
        <p className="font-semibold text-gray-900 truncate">{user.username}</p>
        {user.fullname && (
          <p className="text-gray-500 text-sm truncate">{user.fullname}</p>
        )}
        <p className="text-gray-400 text-xs truncate">
          {user.lastMessage || "No messages yet"}
        </p>
      </div>
      <div className="flex flex-col items-end ml-2">
        {user.unreadCount > 0 && (
          <span className="bg-red-600 text-xs px-2 py-1 rounded-full text-white mb-1">
            {user.unreadCount}
          </span>
        )}
        {user.lastMessageTime && (
          <p className="text-gray-400 text-xs">
            {new Date(user.lastMessageTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
      </div>
    </li>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed h-full">
        <Sidebar />
      </div>

      {/* Left panel: Inbox list */}
      <div className="w-80 ml-64 border-r border-gray-200 flex flex-col">
        <h2 className="text-xl font-bold p-4 border-b bg-white">Inbox</h2>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <p className="p-4 text-gray-500">Loading...</p>
          ) : followingList.length === 0 ? (
            <p className="p-4 text-gray-500">
              You are not following anyone yet.
            </p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {followingList.map((user) => (
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
            refreshInbox={fetchFollowingInbox} // ✅ update counts after actions
          />
        ) : (
          <div className="flex items-center justify-center flex-1 text-gray-400">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default Inbox;
