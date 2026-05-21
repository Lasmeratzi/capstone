import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCompass,
  faSearch,
  faBars,
  faTimes,
  faSun,
  faMoon,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { User, Hash, MapPin, Image as ImageIcon, Search } from "lucide-react";
import logo from "../../assets/images/illura.png";

const Navbar = () => {
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);
  const [targetPage, setTargetPage] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // Search States
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);

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

  // Sync state if theme is changed from another component (like Sidebar)
  useEffect(() => {
    const syncTheme = () => {
      const currentTheme = localStorage.getItem("theme") === "dark";
      if (currentTheme !== darkMode) {
        setDarkMode(currentTheme);
      }
    };
    window.addEventListener("storage", syncTheme);
    return () => window.removeEventListener("storage", syncTheme);
  }, [darkMode]);

  // Handle Search Suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.trim().length < 1) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/search/public/quick?query=${encodeURIComponent(searchTerm)}`
        );
        setSuggestions(response.data.results || []);
      } catch (error) {
        console.error("Error fetching search suggestions:", error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Close suggestions on click outside
  useEffect(() => {
    const handleClickOutside = () => setShowSuggestions(false);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleNavigation = (path) => {
    setIsNavigating(true);
    setTargetPage(path);
    setTimeout(() => {
      navigate(path);
    }, 500);
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={isNavigating ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 bg-white/80 dark:bg-[#0A0A0B]/80 backdrop-blur-md border-b border-gray-100 dark:border-white/5 transition-all duration-300"
    >
      {/* Mobile View */}
      <div className="md:hidden w-full h-16 flex items-center justify-between px-4 shadow-sm">
        {/* Logo */}
        <div 
          onClick={() => navigate("/")}
          className="flex items-center space-x-2 cursor-pointer group"
        >
          <img
            src={logo}
            alt="Illura Logo"
            className="w-8 h-8 group-hover:scale-110 transition-transform duration-200"
          />
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-400 custom-font group-hover:text-[#5E66FF] transition-colors duration-200">
            Illura
          </h1>
        </div>

        {/* Search */}
        <div className="relative w-32" onClick={(e) => e.stopPropagation()}>
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"
          />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const isAuthenticated = localStorage.getItem("token");
                navigate(isAuthenticated ? "/searchprofile" : "/login");
                setShowSuggestions(false);
              }
            }}
            className="w-full pl-9 pr-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-400 rounded-full placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#5E66FF] transition-colors"
          />
          {/* Mobile Suggestions Dropdown */}
          <AnimatePresence>
            {showSuggestions && (searchTerm.trim() || loading) && (
              <SuggestionsDropdown 
                suggestions={suggestions} 
                loading={loading} 
                onSelect={(path) => {
                  setShowSuggestions(false);
                  navigate(path);
                }}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Theme Toggle & Burger */}
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleDarkMode}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            className="w-8 h-8 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-[#5E66FF] transition-all bg-gray-100 dark:bg-white/5 rounded-full border border-gray-200 dark:border-white/10 cursor-pointer"
          >
            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="text-gray-900 dark:text-gray-200 text-xl"
          >
            <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="md:hidden absolute right-4 top-16 bg-white dark:bg-[#0A0A0B] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl overflow-hidden w-48 z-50 transition-colors"
        >
          {/* Menu Items */}
          <div className="flex flex-col">
            {[
              { label: "About", path: "/about" },
              { label: "Contact Us", path: "/contact" },
              { label: "Terms & Services", path: "/terms" },
            ].map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  setMenuOpen(false);
                  navigate(item.path);
                }}
                className="text-gray-700 dark:text-gray-400 text-sm text-right px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-[#5E66FF] transition-all duration-300 cursor-pointer hover:pl-6"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 dark:border-gray-800 my-1" />

          {/* Auth Buttons */}
          <div className="flex flex-col space-y-2 px-4 py-4">
            <button
              onClick={() => {
                setMenuOpen(false);
                handleNavigation("/login");
              }}
              className="px-3 py-2 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-all duration-200 text-sm font-medium cursor-pointer"
            >
              Log In
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                handleNavigation("/signup");
              }}
              className="px-3 py-1 bg-[#5E66FF] text-white rounded-full hover:bg-[#4D5BFF] transition duration-150 text-sm cursor-pointer"
            >
              Sign Up
            </button>
          </div>
        </motion.div>
      )}

      {/* Desktop View */}
      <div className="hidden md:flex w-full h-16 items-center justify-between px-6 shadow-sm">
        {/* Left: Logo + Nav + Search */}
        <div className="flex items-center space-x-5">
          <div 
            onClick={() => navigate("/")}
            className="flex items-center space-x-2 cursor-pointer group"
          >
            <img
              src={logo}
              alt="Illura Logo"
              className="w-8 h-8 group-hover:scale-110 transition-transform duration-200"
            />
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-400 custom-font group-hover:text-[#5E66FF] transition-colors duration-200">
              Illura
            </h1>
          </div>

          <nav className="flex items-center space-x-4 ml-4">
            {[
              { label: "About", path: "/about" },
              { label: "Contact Us", path: "/contact" },
              { label: "Terms & Services", path: "/terms" },
            ].map((link) => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className="text-gray-600 dark:text-gray-300 hover:text-[#5E66FF] dark:hover:text-[#5E66FF] text-sm font-medium cursor-pointer hover:scale-105 transition-all duration-300"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="ml-4 relative" onClick={(e) => e.stopPropagation()}>
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"
            />
            <input
              type="text"
              placeholder="Search artists, tags..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const isAuthenticated = localStorage.getItem("token");
                  navigate(isAuthenticated ? "/searchprofile" : "/login");
                  setShowSuggestions(false);
                }
              }}
              className="w-48 focus:w-64 pl-9 pr-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-400 rounded-full placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#5E66FF] transition-all duration-300"
            />
            {/* Desktop Suggestions Dropdown */}
            <AnimatePresence>
              {showSuggestions && (searchTerm.trim() || loading) && (
                <SuggestionsDropdown 
                  suggestions={suggestions} 
                  loading={loading} 
                  onSelect={(path) => {
                    setShowSuggestions(false);
                    navigate(path);
                  }}
                />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right: Auth Buttons */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleDarkMode}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            className="w-10 h-10 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-[#5E66FF] transition-all bg-gray-100 dark:bg-white/5 rounded-full border border-gray-200 dark:border-white/10 hover:border-[#5E66FF]/50 cursor-pointer"
          >
            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleNavigation("/login")}
              className="px-5 py-1.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-all duration-200 text-sm font-medium cursor-pointer"
            >
              Log In
            </button>
          <button
            onClick={() => handleNavigation("/signup")}
            className="px-3 py-1 bg-[#5E66FF] text-white rounded-full hover:bg-[#4D5BFF] transition duration-150 text-sm cursor-pointer"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
    </motion.div>
  );
};

/* ─────────── SUGGESTIONS DROPDOWN COMPONENT ─────────── */
const SuggestionsDropdown = ({ suggestions, loading, onSelect }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'user': return <User size={14} />;
      case 'tag': return <Hash size={14} />;
      case 'location': return <MapPin size={14} />;
      case 'portfolio': return <ImageIcon size={14} />;
      default: return <Search size={14} />;
    }
  };

  const getPath = (item) => {
    // For non-logged users, we'll redirect to specific pages 
    // but many of these are protected. We'll handle that by redirecting to login 
    // or signup if they aren't authenticated.
    const isAuthenticated = localStorage.getItem("token");
    
    if (!isAuthenticated) {
      return "/login";
    }

    switch (item.type) {
      case 'user': return `/visitprofile/${item.id}`;
      case 'tag': return `/tags/${item.name}`;
      case 'location': return `/location/${item.id}`;
      case 'portfolio': return `/visitprofile/${item.user_id}?tab=portfolio`;
      default: return "/home";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute top-full mt-2 left-0 right-0 md:left-auto md:w-80 bg-white dark:bg-[#111112] border border-gray-100 dark:border-gray-800 rounded-xl shadow-2xl overflow-hidden z-50"
    >
      {loading ? (
        <div className="p-4 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-gray-300 border-t-[#5E66FF] rounded-full animate-spin"></div>
          <span className="ml-2 text-xs text-gray-500">Searching...</span>
        </div>
      ) : suggestions.length > 0 ? (
        <div className="max-h-96 overflow-y-auto py-2">
          {suggestions.map((item, index) => (
            <button
              key={`${item.type}-${item.id}-${index}`}
              onClick={() => onSelect(getPath(item))}
              className="w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left"
            >
              <div className="w-8 h-8 flex-shrink-0 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-sm overflow-hidden border border-gray-100 dark:border-gray-700">
                {item.image && item.type !== 'tag' ? (
                  <img 
                    src={`http://localhost:5000/uploads/${item.image}`} 
                    alt="" 
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = ""; e.target.parentElement.innerHTML = getIcon(item.type); }}
                  />
                ) : (
                  <span>{getIcon(item.type)}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-200 truncate">
                  {item.name}
                </p>
                <p className="text-[10px] text-gray-500 truncate uppercase tracking-wider">
                  {item.type} {item.subtitle && `• ${item.subtitle}`}
                </p>
              </div>
            </button>
          ))}
          <div className="border-t border-gray-100 dark:border-gray-800 mt-2 p-2">
            <button 
              onClick={() => onSelect(localStorage.getItem("token") ? "/searchprofile" : "/login")}
              className="w-full py-1.5 text-xs text-[#5E66FF] font-bold hover:bg-[#5E66FF]/5 rounded transition-colors"
            >
              See all results
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 text-center">
          <p className="text-sm text-gray-500">No results found</p>
        </div>
      )}
    </motion.div>
  );
};

export default Navbar;
