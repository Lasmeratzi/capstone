import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCompass,
  faSearch,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Navbar = () => {
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);
  const [targetPage, setTargetPage] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

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
      style={{ backgroundColor: "#00040d" }}
    >
      {/* Mobile View */}
      <div className="md:hidden w-full h-16 flex items-center justify-between px-4 shadow-sm">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img
            src="src/assets/images/illura.png"
            alt="Illura Logo"
            className="w-8 h-8"
          />
          <h1 className="text-lg font-semibold text-white custom-font">
            Illura
          </h1>
        </div>

        {/* Search */}
        <div className="relative w-32">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"
          />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-9 pr-3 py-1.5 text-sm bg-gray-800 text-white rounded-full placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5E66FF]"
          />
        </div>

        {/* Burger Icon */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white text-xl"
        >
          <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="md:hidden absolute right-4 top-16 bg-[#00040d] border border-gray-800 rounded-lg shadow-lg overflow-hidden w-48 z-50"
        >
          {/* Menu Items */}
          <div className="flex flex-col">
            {[
              { label: "Explore", path: "/explore" },
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
                className="text-white text-sm text-right px-4 py-2 hover:bg-gray-800 transition-colors duration-150"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-700 my-1" />

          {/* Auth Buttons */}
          <div className="flex flex-col space-y-2 px-4 py-3">
            <button
              onClick={() => {
                setMenuOpen(false);
                handleNavigation("/login");
              }}
              className="px-3 py-1 bg-gray-800 text-white rounded-full hover:bg-red-500 transition duration-150 text-sm"
            >
              Log In
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                handleNavigation("/signup");
              }}
              className="px-3 py-1 bg-[#5E66FF] text-white rounded-full hover:bg-[#4D5BFF] transition duration-150 text-sm"
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
          <img
            src="src/assets/images/illura.png"
            alt="Illura Logo"
            className="w-8 h-8"
          />
          <h1 className="text-lg font-semibold text-white custom-font">
            Illura
          </h1>

          <nav className="flex items-center space-x-4 ml-4">
            <button
              onClick={() => navigate("/")}
              className="flex items-center text-white hover:text-[#5E66FF] text-sm font-light"
            >
              <FontAwesomeIcon icon={faCompass} className="mr-1" />
              Explore
            </button>
            <button
              onClick={() => navigate("/about")}
              className="text-white hover:text-[#5E66FF] text-sm font-light"
            >
              About
            </button>
            <button
              onClick={() => navigate("/contact")}
              className="text-white hover:text-[#5E66FF] text-sm font-light"
            >
              Contact Us
            </button>
            <button
              onClick={() => navigate("/terms")}
              className="text-white hover:text-[#5E66FF] text-sm font-light"
            >
              Terms & Services
            </button>
          </nav>

          <div className="ml-4 relative">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"
            />
            <input
              type="text"
              placeholder="Search"
              className="w-48 pl-9 pr-3 py-1.5 text-sm bg-gray-800 text-white rounded-full placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5E66FF]"
            />
          </div>
        </div>

        {/* Right: Auth Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleNavigation("/login")}
            className="px-3 py-1 bg-gray-800 text-white rounded-full hover:bg-red-500 transition duration-150 text-sm"
          >
            Log In
          </button>
          <button
            onClick={() => handleNavigation("/signup")}
            className="px-3 py-1 bg-[#5E66FF] text-white rounded-full hover:bg-[#4D5BFF] transition duration-150 text-sm"
          >
            Sign Up
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Navbar;
