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
      className="h-screen w-60 flex flex-col py-4 pl-14 shadow-md"
      style={{ backgroundColor: "#00040d" }}
    >
      {/* Logo and Name in the Same Row */}
      <div className="mb-8 flex items-center space-x-4">
        <img src="src/assets/images/illura.png" alt="Illura Logo" className="w-12 h-12" />
        <h1 className="text-2xl font-bold text-white custom-font">Illura</h1>
      </div>

      {/* Navigation Items */}
      <nav className="flex flex-col space-y-8 flex-grow">
        {/* Home */}
        <button
          onClick={() => navigate("/home")}
          className={`flex items-center hover:text-[#5E66FF] ${isActive("/home")} transition-colors duration-300`}
        >
          <HomeIcon className="h-8 w-8 transition-colors duration-300" /> {/* Smooth icon color */}
          <span className="ml-4 text-lg transition-colors duration-300">Home</span> {/* Smooth text color */}
        </button>

        {/* Search */}
        <button
          onClick={() => navigate("/searchprofile")}
          className={`flex items-center hover:text-[#5E66FF] ${isActive("/search")} transition-colors duration-300`}
        >
          <MagnifyingGlassIcon className="h-8 w-8 transition-colors duration-300" />
          <span className="ml-4 text-lg transition-colors duration-300">Search</span>
        </button>

        {/* Explore */}
        <button
          onClick={() => navigate("/explore")}
          className={`flex items-center hover:text-[#5E66FF] ${isActive("/explore")} transition-colors duration-300`}
        >
          <GlobeAltIcon className="h-8 w-8 transition-colors duration-300" />
          <span className="ml-4 text-lg transition-colors duration-300">Explore</span>
        </button>

        {/* Notifications */}
        <button
          onClick={() => navigate("/notifications")}
          className={`flex items-center hover:text-[#5E66FF] ${isActive("/notifications")} transition-colors duration-300`}
        >
          <BellIcon className="h-8 w-8 transition-colors duration-300" />
          <span className="ml-4 text-lg transition-colors duration-300">Notifications</span>
        </button>

        {/* Profile */}
        <button
          onClick={() => navigate("/profile")}
          className={`flex items-center hover:text-[#5E66FF] ${isActive("/profile")} transition-colors duration-300`}
        >
          <UserIcon className="h-8 w-8 transition-colors duration-300" />
          <span className="ml-4 text-lg transition-colors duration-300">Profile</span>
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
          className="flex items-center text-white hover:text-red-500 transition-colors duration-300"
        >
          <ArrowRightOnRectangleIcon className="h-8 w-8 transition-colors duration-300" />
          <span className="ml-4 text-lg transition-colors duration-300">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;