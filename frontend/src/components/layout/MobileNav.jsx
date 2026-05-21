import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  HomeIcon,
  MagnifyingGlassIcon,
  BellIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  ChatBubbleLeftEllipsisIcon,
  TrophyIcon,
  PlusIcon,
  SunIcon,
  MoonIcon,
  ArrowRightOnRectangleIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/solid";

const MobileNav = ({ onOpenCreate }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  const userId = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + "/");

  // Fetch notification badge
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
      const interval = setInterval(fetchNotifications, 15000);
      return () => clearInterval(interval);
    }
  }, [userId, token]);

  // Fetch unread messages badge
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
      const interval = setInterval(fetchUnreadMessages, 15000);
      return () => clearInterval(interval);
    }
  }, [userId, token]);

  // Theme sync
  useEffect(() => {
    const syncTheme = () => {
      setDarkMode(localStorage.getItem("theme") === "dark");
    };
    window.addEventListener("storage", syncTheme);
    return () => window.removeEventListener("storage", syncTheme);
  }, []);

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    window.dispatchEvent(new Event("storage"));
  };

  const handleLogout = () => {
    const currentTheme = localStorage.getItem("theme");
    localStorage.clear();
    sessionStorage.clear();
    if (currentTheme) {
      localStorage.setItem("theme", currentTheme);
    }
    navigate("/login");
  };

  const bottomNavItems = [
    { icon: HomeIcon, path: "/home", label: "Home" },
    { icon: MagnifyingGlassIcon, path: "/searchprofile", label: "Search" },
    {
      icon: BellIcon,
      path: "/notifications",
      label: "Alerts",
      badge: hasUnread ? "dot" : null,
    },
    { icon: UserIcon, path: "/profile", label: "Profile" },
  ];

  const drawerNavItems = [
    {
      icon: EnvelopeIcon,
      path: "/inbox",
      label: "Messages",
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : null,
    },
    { icon: TrophyIcon, path: "/auctionwins", label: "Auction Wins" },
    { icon: ChatBubbleLeftEllipsisIcon, path: "/chatbot", label: "Chatbot" },
  ];

  return (
    <>
      {/* ─── Top Header Bar ─── */}
      <div className="fixed top-0 left-0 right-0 z-50 md:hidden">
        <div className="bg-white/80 dark:bg-[#0A0A0B]/80 backdrop-blur-xl border-b border-gray-200/60 dark:border-white/5">
          <div className="flex items-center justify-between px-4 h-14">
            {/* Logo */}
            <div
              onClick={() => navigate("/home")}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <img
                src="/illura.png"
                alt="Illura"
                className="w-8 h-8"
              />
              <h1 className="text-lg font-bold text-gray-900 dark:text-white custom-font tracking-tight">
                Illura
              </h1>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-1">
              {/* Create Button */}
              {onOpenCreate && (
                <button
                  onClick={onOpenCreate}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-[#5E66FF] text-white shadow-md shadow-indigo-200/40 dark:shadow-none active:scale-95 transition-transform cursor-pointer"
                >
                  <PlusIcon className="h-5 w-5" />
                </button>
              )}

              {/* Messages shortcut */}
              <button
                onClick={() => navigate("/inbox")}
                className="relative w-9 h-9 flex items-center justify-center rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <EnvelopeIcon className="h-5 w-5" />
                {unreadMessagesCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>

              {/* Burger Menu */}
              <button
                onClick={() => setDrawerOpen(true)}
                className="w-9 h-9 flex items-center justify-center rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Slide-Out Drawer ─── */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-white dark:bg-[#0A0A0B] border-l border-gray-200 dark:border-white/5 shadow-2xl flex flex-col animate-slide-in-right">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 h-14 border-b border-gray-100 dark:border-white/5">
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Menu
              </h2>
              <button
                onClick={() => setDrawerOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation Items */}
            <div className="flex-1 overflow-y-auto py-3 px-3">
              <div className="space-y-0.5">
                {drawerNavItems.map(({ icon: Icon, path, label, badge }) => (
                  <button
                    key={path}
                    onClick={() => {
                      navigate(path);
                      setDrawerOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                      isActive(path)
                        ? "bg-[#5E66FF]/10 text-[#5E66FF]"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{label}</span>
                    {badge && (
                      <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                        {badge > 99 ? "99+" : badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100 dark:border-white/5 my-3" />

              {/* Theme Toggle */}
              <button
                onClick={toggleDarkMode}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-all duration-200 cursor-pointer"
              >
                {darkMode ? (
                  <>
                    <SunIcon className="h-5 w-5" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <MoonIcon className="h-5 w-5" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            </div>

            {/* Logout at bottom */}
            <div className="px-3 py-4 border-t border-gray-100 dark:border-white/5">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/5 transition-all duration-200 cursor-pointer"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Bottom Navigation Bar ─── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className="bg-white/80 dark:bg-[#0A0A0B]/80 backdrop-blur-xl border-t border-gray-200/60 dark:border-white/5">
          <div className="flex items-center justify-around h-16 px-2">
            {bottomNavItems.map(({ icon: Icon, path, label, badge }) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`flex flex-col items-center justify-center w-16 py-1 rounded-xl transition-all duration-200 cursor-pointer ${
                  isActive(path)
                    ? "text-[#5E66FF]"
                    : "text-gray-400 dark:text-gray-500 active:text-gray-600"
                }`}
              >
                <div className="relative">
                  <Icon className={`h-6 w-6 transition-transform duration-200 ${isActive(path) ? "scale-110" : ""}`} />
                  {badge === "dot" && (
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-[#0A0A0B]" />
                  )}
                </div>
                <span className={`text-[10px] mt-1 font-semibold ${isActive(path) ? "text-[#5E66FF]" : ""}`}>
                  {label}
                </span>
                {isActive(path) && (
                  <div className="absolute bottom-1 w-5 h-0.5 bg-[#5E66FF] rounded-full" />
                )}
              </button>
            ))}
          </div>
          {/* Safe area for devices with home indicators */}
          <div className="h-safe-bottom bg-white/80 dark:bg-[#0A0A0B]/80" />
        </div>
      </div>
    </>
  );
};

export default MobileNav;
