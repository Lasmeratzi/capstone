import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faSearch, faCompass, faBell, faUser, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate(); // Hook for navigation

  const handleLogout = () => {
    // Clear tokens and redirect to login
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <div
      className="h-screen w-20 shadow-md flex flex-col items-center py-4 px-14"
      style={{ backgroundColor: "#00040d" }}
    >
      {/* Logo */}
      <div className="mb-8">
        <img
          src="src/assets/images/illura.png"
          alt="Illura Logo"
          className="w-16 h-16" // Adjust size as needed
        />
        <h1 className="text-2xl font-bold text-white custom-font">Illura</h1>
      </div>

      {/* Navigation Items */}
      <nav className="flex flex-col space-y-6 flex-grow">
        {/* Home */}
        <button
          onClick={() => navigate("/home")}
          className="flex flex-col items-center text-white hover:text-[#5E66FF]"
        >
          <FontAwesomeIcon icon={faHome} size="lg" />
          <span className="text-xs mt-1">Home</span>
        </button>

        {/* Search */}
        <button
          onClick={() => navigate("/search")}
          className="flex flex-col items-center text-white hover:text-[#5E66FF]"
        >
          <FontAwesomeIcon icon={faSearch} size="lg" />
          <span className="text-xs mt-1">Search</span>
        </button>

        {/* Explore */}
        <button
          onClick={() => navigate("/explore")}
          className="flex flex-col items-center text-white hover:text-[#5E66FF]"
        >
          <FontAwesomeIcon icon={faCompass} size="lg" />
          <span className="text-xs mt-1">Explore</span>
        </button>

        {/* Notifications */}
        <button
          onClick={() => navigate("/notifications")}
          className="flex flex-col items-center text-white hover:text-[#5E66FF]"
        >
          <FontAwesomeIcon icon={faBell} size="lg" />
          <span className="text-xs mt-1">Notifications</span>
        </button>

        {/* Profile */}
        <button
          onClick={() => navigate("/profiles")}
          className="flex flex-col items-center text-white hover:text-[#5E66FF]"
        >
          <FontAwesomeIcon icon={faUser} size="lg" />
          <span className="text-xs mt-1">Profile</span>
        </button>
      </nav>

      {/* Log Out Button */}
      <button
        onClick={handleLogout}
        className="mt-6 flex flex-col items-center text-white hover:text-red-500"
      >
        <FontAwesomeIcon icon={faSignOutAlt} size="lg" />
        <span className="text-xs mt-1 w-100">Log Out</span>
      </button>
    </div>
  );
};

export default Sidebar;