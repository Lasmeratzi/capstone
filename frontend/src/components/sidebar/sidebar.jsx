import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faSearch,
  faCompass,
  faBell,
  faUser,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import SearchBar from "../searchbar/searchbar"; // Import the updated SearchBar component

const Sidebar = () => {
  const navigate = useNavigate();
  const [isSearchBarOpen, setIsSearchBarOpen] = useState(false); // State to toggle search bar

  const toggleSearchBar = () => {
    setIsSearchBarOpen((prevState) => !prevState); // Toggle search bar visibility
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <div
      className="h-screen w-20 flex flex-col items-center py-4 shadow-md"
      style={{ backgroundColor: "#00040d" }}
    >
      {/* Logo */}
      <div className="mb-6 flex flex-col items-center">
        <img
          src="src/assets/images/illura.png"
          alt="Illura Logo"
          className="w-12 h-12"
        />
        <h1 className="text-lg font-bold text-white custom-font mt-2">Illura</h1>
      </div>

      {/* Navigation Items */}
      <nav className="flex flex-col space-y-8 flex-grow">
        {/* Home */}
        <div className="relative group">
          <button
            onClick={() => navigate("/home")}
            className="flex items-center justify-center text-white hover:text-[#5E66FF]"
          >
            <FontAwesomeIcon icon={faHome} size="2x" />
          </button>
          <span
            className="absolute left-full -translate-y-8 ml-2 bg-[#00040d] text-white px-3 py-1 rounded hidden group-hover:block text-sm"
          >
            Home
          </span>
        </div>

        {/* Search */}
        <div className="relative group">
          <button
            onClick={toggleSearchBar}
            className="flex items-center justify-center text-white hover:text-[#5E66FF]"
          >
            <FontAwesomeIcon icon={faSearch} size="2x" />
          </button>
          <span
            className="absolute left-full -translate-y-8 ml-2 bg-[#00040d] text-white px-3 py-1 rounded hidden group-hover:block text-sm"
          >
            Search
          </span>
        </div>

        {/* Explore */}
        <div className="relative group">
          <button
            onClick={() => navigate("/explore")}
            className="flex items-center justify-center text-white hover:text-[#5E66FF]"
          >
            <FontAwesomeIcon icon={faCompass} size="2x" />
          </button>
          <span
            className="absolute left-full -translate-y-8 ml-2 bg-[#00040d] text-white px-3 py-1 rounded hidden group-hover:block text-sm"
          >
            Explore
          </span>
        </div>

        {/* Notifications */}
        <div className="relative group">
          <button
            onClick={() => navigate("/notifications")}
            className="flex items-center justify-center text-white hover:text-[#5E66FF]"
          >
            <FontAwesomeIcon icon={faBell} size="2x" />
          </button>
          <span
            className="absolute left-full -translate-y-8 ml-2 bg-[#00040d] text-white px-3 py-1 rounded hidden group-hover:block text-sm"
          >
            Notifications
          </span>
        </div>

        {/* Profile */}
        <div className="relative group">
          <button
            onClick={() => navigate("/profiles")}
            className="flex items-center justify-center text-white hover:text-[#5E66FF]"
          >
            <FontAwesomeIcon icon={faUser} size="2x" />
          </button>
          <span
            className="absolute left-full -translate-y-8 ml-2 bg-[#00040d] text-white px-3 py-1 rounded hidden group-hover:block text-sm"
          >
            Profile
          </span>
        </div>
      </nav>

      {/* Log Out Button */}
      <div className="relative group mt-8">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center text-white hover:text-red-500"
        >
          <FontAwesomeIcon icon={faSignOutAlt} size="2x" />
        </button>
        <span
          className="absolute left-full -translate-y-8 ml-2 bg-red-500 text-white px-3 py-1 rounded hidden group-hover:block text-sm"
        >
          Log Out
        </span>
      </div>

      {/* SearchBar Pop-Up */}
      <SearchBar
        isOpen={isSearchBarOpen}
        closeSearchBar={toggleSearchBar}
      />
    </div>
  );
};

export default Sidebar;