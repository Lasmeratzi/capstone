import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faSearch, faCompass, faBell, faUser, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate(); // Hook for navigation

  const handleLogout = () => {
    // Logic for logging out (if necessary, e.g., clearing tokens)
    navigate("/"); // Navigate back to the login page
  };

  return (
    <div className="h-screen w-20 bg-white shadow-md flex flex-col items-center py-4">
      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-blue-600">Illura</h1>
      </div>

      {/* Navigation Items */}
      <nav className="flex flex-col space-y-6 flex-grow">
        {/* Home */}
        <a href="#" className="flex flex-col items-center text-gray-600 hover:text-blue-600">
          <FontAwesomeIcon icon={faHome} size="lg" />
          <span className="text-xs mt-1">Home</span>
        </a>

        {/* Search */}
        <a href="#" className="flex flex-col items-center text-gray-600 hover:text-blue-600">
          <FontAwesomeIcon icon={faSearch} size="lg" />
          <span className="text-xs mt-1">Search</span>
        </a>

        {/* Explore */}
        <a href="#" className="flex flex-col items-center text-gray-600 hover:text-blue-600">
          <FontAwesomeIcon icon={faCompass} size="lg" />
          <span className="text-xs mt-1">Explore</span>
        </a>

        {/* Notifications */}
        <a href="#" className="flex flex-col items-center text-gray-600 hover:text-blue-600">
          <FontAwesomeIcon icon={faBell} size="lg" />
          <span className="text-xs mt-1">Notifications</span>
        </a>

        {/* Profile */}
        <a href="#" className="flex flex-col items-center text-gray-600 hover:text-blue-600">
          <FontAwesomeIcon icon={faUser} size="lg" />
          <span className="text-xs mt-1">Profile</span>
        </a>
      </nav>

      {/* Log Out Button */}
      <button
        onClick={handleLogout}
        className="mt-6 flex flex-col items-center text-gray-600 hover:text-red-600"
      >
        <FontAwesomeIcon icon={faSignOutAlt} size="lg" />
        <span className="text-xs mt-1">Log Out</span>
      </button>
    </div>
  );
};

export default Sidebar;