import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCompass, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Import Framer Motion for animations

const Navbar = () => {
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false); // State for fade-out animation
  const [targetPage, setTargetPage] = useState(""); // State to store the navigation target

  const handleNavigation = (path) => {
    setIsNavigating(true); // Trigger fade-out animation
    setTargetPage(path); // Set the target page
    setTimeout(() => {
      navigate(path); // Navigate after the animation completes
    }, 500); // Match the animation duration
  };

  return (
    <motion.div
      initial={{ opacity: 1 }} // Navbar starts fully visible
      animate={isNavigating ? { opacity: 0 } : { opacity: 1 }} // Fade-out on navigation
      transition={{ duration: 0.5, ease: "easeOut" }} // Smooth animation timing
      className="w-full h-16 flex items-center justify-between px-6 shadow-sm"
      style={{ backgroundColor: "#00040d" }}
    >
      {/* Left: Logo + Nav + Search */}
      <div className="flex items-center space-x-5">
        {/* Logo */}
        <img
          src="src/assets/images/illura.png"
          alt="Illura Logo"
          className="w-8 h-8"
        />
        <h1 className="text-lg font-semibold text-white custom-font">Illura</h1>

        {/* Navigation */}
        <nav className="flex items-center space-x-4 ml-4">
          <button
            onClick={() => navigate("/explore")}
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
        </nav>

        {/* Search */}
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
        {/* Link Log In Button */}
        <button
          onClick={() => handleNavigation("/login")} // Trigger fade-out and navigate to login
          className="px-3 py-1 bg-gray-800 text-white rounded-full hover:bg-red-500 transition duration-150 text-sm"
        >
          Log In
        </button>

        {/* Link Sign Up Button */}
        <button
          onClick={() => handleNavigation("/signup")} // Trigger fade-out and navigate to signup
          className="px-3 py-1 bg-[#5E66FF] text-white rounded-full hover:bg-[#4D5BFF] transition duration-150 text-sm"
        >
          Sign Up
        </button>
      </div>
    </motion.div>
  );
};

export default Navbar;