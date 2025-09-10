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
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0); // ✅ number of unread messages
  const userId = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  const isActive = (path) => location.pathname === path;

  // 🔔 Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/notifications/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const unreadExists = response.data.some((notif) => !notif.is_read);
        setHasUnread(unreadExists);
      } catch (error) {
        console.error("Failed to fetch notifications for sidebar:", error);
      }
    };

    if (userId && token) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 10000); // 🔁 poll every 10s
      return () => clearInterval(interval);
    }
  }, [userId, token]);

  // 💬 Fetch unread messages
  useEffect(() => {
    const fetchUnreadMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/messages/following-inbox`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // sum up total unread counts
        const totalUnread = response.data.reduce(
          (sum, conv) => sum + (conv.unreadCount || 0),
          0
        );
        setUnreadMessagesCount(totalUnread);
      } catch (error) {
        console.error("Failed to fetch unread messages for sidebar:", error);
      }
    };

    if (userId && token) {
      fetchUnreadMessages();
      const interval = setInterval(fetchUnreadMessages, 10000); // 🔁 poll every 10s
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
      showBadge: hasUnread ? "dot" : null, // ✅ dot only
    },
    {
      label: "Messages",
      icon: ChatBubbleLeftEllipsisIcon,
      path: "/inbox",
      showBadge: unreadMessagesCount > 0 ? unreadMessagesCount : null, // ✅ number badge
    },
    { label: "Profile", icon: UserIcon, path: "/profile" },
    { label: "Auction Wins", icon: TrophyIcon, path: "/auctionwins" },
  ];

  return (
    <div
      className="h-screen w-60 flex flex-col py-4 pl-14 shadow-md"
      style={{ backgroundColor: "#00040d" }}
    >
      {/* Logo */}
      <div className="mb-5 flex items-center space-x-4">
        <img
          src="src/assets/images/illura.png"
          alt="Illura Logo"
          className="w-12 h-12"
        />
        <h1 className="text-2xl font-bold text-white custom-font">Illura</h1>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col space-y-6 flex-grow">
        {navItems.map(({ label, icon: Icon, path, showBadge }) => (
          <button
            key={label}
            onClick={() => navigate(path)}
            className={`relative flex items-center hover:text-[#5E66FF] ${
              isActive(path) ? "text-[#5E66FF] font-bold" : "text-white"
            } transition-colors duration-300`}
          >
            <Icon className="h-8 w-8" />
            {showBadge &&
              (showBadge === "dot" ? (
                <span
                  className="absolute top-0 left-5 block h-3 w-3 rounded-full bg-red-600 ring-2 ring-black"
                  aria-label={`Unread ${label.toLowerCase()}`}
                />
              ) : (
                <span className="absolute -top-2 left-5 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow">
                  {showBadge}
                </span>
              ))}
            <span className="ml-4 text-lg">{label}</span>
          </button>
        ))}

        {/* Chatbot with hover icon swap */}
        <button
          onClick={() => navigate("/chatbot")}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`flex items-center hover:text-[#5E66FF] ${
            isActive("/chatbot") ? "text-[#5E66FF] font-bold" : "text-white"
          } transition-colors duration-300 ease-in-out`}
        >
          <img
            src={isHovered || isActive("/chatbot") ? "/qwenhover.png" : "/qwenwhite.png"}
            alt="AI Icon"
            className="h-8 w-8 transition-opacity duration-300 ease-in-out"
          />
          <span className="ml-4 text-lg transition-colors duration-300 ease-in-out">
            Chatbot
          </span>
        </button>
      </nav>

      {/* Divider Line Above Logout (Limited Width) */}
      <div className="w-fit border-t border-gray-600 mt-8 mb-4" />

      {/* Logout */}
      <div>
        <button
          onClick={() => {
            localStorage.clear();
            sessionStorage.clear();
            navigate("/login");
          }}
          className="flex items-center text-white hover:text-red-500 transition-colors duration-300"
        >
          <ArrowRightOnRectangleIcon className="h-8 w-8" />
          <span className="ml-4 text-lg">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
