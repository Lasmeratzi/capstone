import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  HomeIcon,
  MagnifyingGlassIcon,
  GlobeAltIcon, // Explore Icon
  BellIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid"; // Import Heroicons

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Determine current route
  const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);

  const toggleSearchBar = () => {
    setIsSearchBarOpen((prevState) => !prevState);
  };

  // Active styling for the current page
  const isActive = (path) => (location.pathname === path ? "text-[#5E66FF] font-bold" : "text-white");

  return (
    <div
      className="h-screen w-60 flex flex-col py-4 pl-14 shadow-md" // Added padding-left for spacing
      style={{ backgroundColor: "#00040d" }}
    >
      {/* Logo and Name in the Same Row */}
      <div className="mb-8 flex items-center space-x-4">
        <img src="src/assets/images/illura.png" alt="Illura Logo" className="w-12 h-12" />
        <h1 className="text-2xl font-bold text-white custom-font">Illura</h1> {/* Increased font size */}
      </div>

      {/* Navigation Items */}
      <nav className="flex flex-col space-y-8 flex-grow">
        {/* Home */}
        <button
          onClick={() => navigate("/home")}
          className={`flex items-center hover:text-[#5E66FF] ${isActive("/home")}`}
        >
          <HomeIcon className="h-8 w-8" /> {/* Increased icon size */}
          <span className="ml-4 text-lg">Home</span> {/* Increased text size */}
        </button>

        {/* Search */}
        <button
          onClick={toggleSearchBar}
          className={`flex items-center hover:text-[#5E66FF] ${isActive("/search")}`}
        >
          <MagnifyingGlassIcon className="h-8 w-8" /> {/* Increased icon size */}
          <span className="ml-4 text-lg">Search</span> {/* Increased text size */}
        </button>

        {/* Explore */}
        <button
          onClick={() => navigate("/explore")}
          className={`flex items-center hover:text-[#5E66FF] ${isActive("/explore")}`}
        >
          <GlobeAltIcon className="h-8 w-8" /> {/* Increased icon size */}
          <span className="ml-4 text-lg">Explore</span> {/* Increased text size */}
        </button>

        {/* Notifications */}
        <button
          onClick={() => navigate("/notifications")}
          className={`flex items-center hover:text-[#5E66FF] ${isActive("/notifications")}`}
        >
          <BellIcon className="h-8 w-8" /> {/* Increased icon size */}
          <span className="ml-4 text-lg">Notifications</span> {/* Increased text size */}
        </button>

        {/* Profile */}
        <button
          onClick={() => navigate("/profile")}
          className={`flex items-center hover:text-[#5E66FF] ${isActive("/profile")}`}
        >
          <UserIcon className="h-8 w-8" /> {/* Increased icon size */}
          <span className="ml-4 text-lg">Profile</span> {/* Increased text size */}
        </button>
      </nav>

      {/* Log Out */}
      <div className="mt-8">
        <button
          onClick={() => {
            localStorage.clear();
            sessionStorage.clear();
            navigate("/login");
          }}
          className="flex items-center text-white hover:text-red-500"
        >
          <ArrowRightOnRectangleIcon className="h-8 w-8" /> {/* Increased icon size */}
          <span className="ml-4 text-lg">Logout</span> {/* Increased text size */}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;