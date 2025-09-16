import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import {
  HomeIcon,
  MagnifyingGlassIcon,
  GlobeAltIcon,
  BellIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  TrophyIcon,
  ChatBubbleLeftEllipsisIcon,
} from "@heroicons/react/24/solid";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  const userId = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  const isActive = (path) => location.pathname === path;

  // 🔔 Notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/notifications/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setHasUnread(response.data.some((notif) => !notif.is_read));
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    if (userId && token) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 10000);
      return () => clearInterval(interval);
    }
  }, [userId, token]);

  // 💬 Messages
  useEffect(() => {
    const fetchUnreadMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/messages/following-inbox`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const totalUnread = response.data.reduce(
          (sum, conv) => sum + (conv.unreadCount || 0),
          0
        );
        setUnreadMessagesCount(totalUnread);
      } catch (error) {
        console.error("Failed to fetch unread messages:", error);
      }
    };

    if (userId && token) {
      fetchUnreadMessages();
      const interval = setInterval(fetchUnreadMessages, 10000);
      return () => clearInterval(interval);
    }
  }, [userId, token]);

  const navItems = [
    { label: "Home", icon: HomeIcon, path: "/home" },
    { label: "Search", icon: MagnifyingGlassIcon, path: "/searchprofile" },
    { label: "Explore", icon: GlobeAltIcon, path: "/explore" },
    {
      label: "Notifications",
      icon: BellIcon,
      path: "/notifications",
      showBadge: hasUnread ? "dot" : null,
    },
    {
      label: "Messages",
      icon: ChatBubbleLeftEllipsisIcon,
      path: "/inbox",
      showBadge: unreadMessagesCount > 0 ? unreadMessagesCount : null,
    },
    { label: "Profile", icon: UserIcon, path: "/profile" },
    { label: "Auction Wins", icon: TrophyIcon, path: "/auctionwins" },
  ];

  return (
    <div
      className="h-screen w-64 flex flex-col py-6 px-4 border-r"
      style={{
        backgroundColor: "#0D1117", // modern dark base
        borderColor: "#30363D", // subtle GitHub border
      }}
    >
      {/* Logo */}
      <div className="mb-10 flex items-center space-x-3 px-2">
        <img
          src="src/assets/images/illura.png"
          alt="Illura Logo"
          className="w-10 h-10"
        />
        <h1 className="text-2xl font-bold text-white custom-font tracking-tight">
          Illura
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col space-y-1 flex-grow">
        {navItems.map(({ label, icon: Icon, path, showBadge }) => (
          <button
            key={label}
            onClick={() => navigate(path)}
            className={`relative flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200
              ${
                isActive(path)
                  ? "bg-[#5E66FF] text-white shadow-md"
                  : "text-gray-300 hover:bg-[#161B22] hover:text-[#5E66FF]"
              }`}
          >
            <Icon className="h-5 w-5" />
            {showBadge &&
              (showBadge === "dot" ? (
                <span className="absolute top-1 left-5 block h-2 w-2 rounded-full bg-red-500" />
              ) : (
                <span className="absolute -top-2 left-5 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                  {showBadge}
                </span>
              ))}
            <span className="ml-3">{label}</span>
          </button>
        ))}

        {/* Chatbot */}
        <button
          onClick={() => navigate("/chatbot")}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200
            ${
              isActive("/chatbot")
                ? "bg-[#5E66FF] text-white shadow-md"
                : "text-gray-300 hover:bg-[#161B22] hover:text-[#5E66FF]"
            }`}
        >
          <img
            src={
              isHovered || isActive("/chatbot")
                ? "/qwenhover.png"
                : "/qwenwhite.png"
            }
            alt="AI Icon"
            className="h-5 w-5"
          />
          <span className="ml-3">Chatbot</span>
        </button>
      </nav>

      {/* Divider */}
      <div className="border-t border-[#30363D] my-5" />

      {/* Logout */}
      <div className="px-2">
        <button
          onClick={() => {
            localStorage.clear();
            sessionStorage.clear();
            navigate("/login");
          }}
          className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-300 hover:text-red-500 hover:bg-[#161B22] transition-colors duration-200"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          <span className="ml-3">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
