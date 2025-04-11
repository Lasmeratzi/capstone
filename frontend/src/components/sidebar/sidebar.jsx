import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faSearch, faCompass, faBell, faUser, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

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
      className="h-screen w-20 flex flex-col items-center py-4 px-4 shadow-md"
      style={{ backgroundColor: "#00040d" }}
    >
      {/* Logo */}
      <div className="mb-6 flex flex-col items-center">
        <img
          src="src/assets/images/illura.png"
          alt="Illura Logo"
          className="w-12 h-12" // Reduced size for logo
        />
        <h1 className="text-lg font-bold text-white custom-font mt-2">Illura</h1> {/* Smaller text */}
      </div>

      {/* Navigation Items */}
      <nav className="flex flex-col space-y-8 flex-grow">
        {/* Home */}
        <div className="relative group">
          <button
            onClick={() => navigate("/home")}
            className="flex items-center justify-center text-white hover:text-[#5E66FF]"
          >
            <FontAwesomeIcon icon={faHome} size="2x" /> {/* Larger icon */}
          </button>
          <span className="absolute left-full ml-2 bg-[#00040d] text-white px-3 py-1 rounded hidden group-hover:block text-sm">
            Home
          </span>
        </div>

        {/* Search */}
        <div className="relative group">
          <button
            onClick={() => navigate("/search")}
            className="flex items-center justify-center text-white hover:text-[#5E66FF]"
          >
            <FontAwesomeIcon icon={faSearch} size="2x" /> {/* Larger icon */}
          </button>
          <span className="absolute left-full ml-2 bg-[#00040d] text-white px-3 py-1 rounded hidden group-hover:block text-sm">
            Search
          </span>
        </div>

        {/* Explore */}
        <div className="relative group">
          <button
            onClick={() => navigate("/explore")}
            className="flex items-center justify-center text-white hover:text-[#5E66FF]"
          >
            <FontAwesomeIcon icon={faCompass} size="2x" /> {/* Larger icon */}
          </button>
          <span className="absolute left-full ml-2 bg-[#00040d] text-white px-3 py-1 rounded hidden group-hover:block text-sm">
            Explore
          </span>
        </div>

        {/* Notifications */}
        <div className="relative group">
          <button
            onClick={() => navigate("/notifications")}
            className="flex items-center justify-center text-white hover:text-[#5E66FF]"
          >
            <FontAwesomeIcon icon={faBell} size="2x" /> {/* Larger icon */}
          </button>
          <span className="absolute left-full ml-2 bg-[#00040d] text-white px-3 py-1 rounded hidden group-hover:block text-sm">
            Notifications
          </span>
        </div>

        {/* Profile */}
        <div className="relative group">
          <button
            onClick={() => navigate("/profiles")}
            className="flex items-center justify-center text-white hover:text-[#5E66FF]"
          >
            <FontAwesomeIcon icon={faUser} size="2x" /> {/* Larger icon */}
          </button>
          <span className="absolute left-full ml-2 bg-[#00040d] text-white px-3 py-1 rounded hidden group-hover:block text-sm">
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
          <FontAwesomeIcon icon={faSignOutAlt} size="2x" /> {/* Larger icon */}
        </button>
        <span className="absolute left-full ml-2 bg-red-500 text-white px-3 py-1 rounded hidden group-hover:block text-sm">
          Log Out
        </span>
      </div>
    </div>
  );
};

export default Sidebar;