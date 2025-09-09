import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../sidebar/sidebar";
import Message from "../message/message";

const Inbox = () => {
  const [followingList, setFollowingList] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
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

    if (token) fetchFollowingInbox();
  }, [token]);

  const UserCard = ({ user }) => (
    <li
      onClick={() => setSelectedUserId(user.userId)}
      className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-all ${
        selectedUserId === user.userId ? "bg-gray-100" : ""
      }`}
    >
      <img
        src={user.pfp ? `http://localhost:5000/uploads/${user.pfp}` : "/default-avatar.png"}
        alt={user.username}
        className="w-12 h-12 rounded-full object-cover border border-gray-200"
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
    <div className="flex bg-white min-h-screen">
      {/* Sidebar */}
      <div className="fixed h-full">
        <Sidebar />
      </div>

      {/* Left panel: Following inbox */}
      <div className="w-80 border-r border-gray-200 ml-64 flex-shrink-0 overflow-y-auto">
        <h2 className="text-xl font-bold p-4 border-b">Inbox</h2>
        {loading ? (
          <p className="p-4 text-gray-500">Loading...</p>
        ) : followingList.length === 0 ? (
          <p className="p-4 text-gray-500">You are not following anyone yet.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-gray-200">
            {followingList.map((user) => (
              <UserCard key={user.userId} user={user} />
            ))}
          </ul>
        )}
      </div>

      {/* Right panel: Message window */}
      <div className="flex-1 ml-[20rem] p-4">
        {selectedUserId ? (
          <Message otherUserId={selectedUserId} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default Inbox;
