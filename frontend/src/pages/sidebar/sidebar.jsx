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
  PencilSquareIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/solid";
import logo from "../../assets/images/illura.png";

const Sidebar = ({ onOpenCreate }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const userId = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  const isActive = (path) => location.pathname === path;

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

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    // Dispatch storage event for other components to sync
    window.dispatchEvent(new Event("storage"));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const navItems = [
    { label: "Home", icon: HomeIcon, path: "/home" },
    { label: "Search", icon: MagnifyingGlassIcon, path: "/searchprofile" },
    
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
      className="h-screen w-50 hidden md:flex flex-col py-6 px-4 relative bg-[#F8FAFC] dark:bg-[#0A0A0B] border-r border-gray-200 dark:border-white/5 transition-colors duration-300"
    >
      {/* Sidebar Content */}
      <div className="flex flex-col flex-grow relative z-10">
        {/* Logo */}
        <div className="mb-10 flex items-center space-x-3 px-2">
          <img
            src={logo}
            alt="Illura Logo"
            className="w-10 h-10"
          />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white custom-font tracking-tight">
            Illura
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col space-y-1 flex-grow">
          {navItems.map(({ label, icon: Icon, path, showBadge }, index) => (
            <React.Fragment key={label}>
              <button
                onClick={() => navigate(path)}
                className={`relative flex items-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 group cursor-pointer
                  ${
                    isActive(path)
                      ? "bg-[#5E66FF]/10 text-[#5E66FF]"
                      : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
                  }`}
              >
                {isActive(path) && (
                  <div className="absolute left-0 w-1 h-5 bg-[#5E66FF] rounded-r-full" />
                )}
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

              {/* Create button under Home */}
              {index === 0 && (
                <button
                  onClick={onOpenCreate}
                  className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#161B22] hover:text-[#5E66FF] transition-colors duration-200 cursor-pointer"
                >
                  <PencilSquareIcon className="h-5 w-5" />
                  <span className="ml-3">Create</span>
                </button>
              )}
            </React.Fragment>
          ))}

          {/* Chatbot */}
          <button
            onClick={() => navigate("/chatbot")}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`relative flex items-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 group cursor-pointer
              ${
                isActive("/chatbot")
                  ? "bg-[#5E66FF]/10 text-[#5E66FF]"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
              }`}
          >
            {isActive("/chatbot") && (
              <div className="absolute left-0 w-1 h-5 bg-[#5E66FF] rounded-r-full" />
            )}
            <img
              src={
                isHovered && !isActive("/chatbot")
                  ? "/qwenhover.png"
                  : (darkMode ? "/qwenwhite.png" : "/qwen.png")
              }
              alt="AI Icon"
              className={`h-5 w-5 ${!darkMode && !isHovered && !isActive("/chatbot") ? "opacity-70" : ""}`}
            />
            <span className="ml-3">Chatbot</span>
          </button>
        </nav>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-white/10 my-5" />

        {/* Theme Toggle & Logout */}
        <div className="px-2 space-y-1">
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-[#5E66FF] hover:bg-[#5E66FF]/5 transition-all duration-200 cursor-pointer"
          >
            {darkMode ? (
              <>
                <SunIcon className="h-5 w-5" />
                <span className="ml-3">Light Mode</span>
              </>
            ) : (
              <>
                <MoonIcon className="h-5 w-5" />
                <span className="ml-3">Dark Mode</span>
              </>
            )}
          </button>
          
          <button
            onClick={() => {
              const currentTheme = localStorage.getItem("theme");
              localStorage.clear();
              sessionStorage.clear();
              if (currentTheme) {
                localStorage.setItem("theme", currentTheme);
              }
              navigate("/login");
            }}
            className="w-full flex items-center rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-red-400 hover:bg-red-400/5 transition-all duration-200 cursor-pointer"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
