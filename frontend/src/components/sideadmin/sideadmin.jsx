import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

const SideAdmin = () => {
  const navigate = useNavigate(); // Hook for navigation

  return (
    <div className="h-screen w-48 bg-gray-900 text-white flex flex-col shadow-lg">
      {/* Sidebar Header */}
      <div className="py-4 px-4 bg-gray-800 border-b border-gray-700 flex items-center">
        <img
          src="src/assets/images/illura.png" // Update this path based on your assets structure
          alt="Illura Logo"
          className="w-8 h-8 mr-2" // Adjust size and spacing for logo
        />
        <h1 className="text-sm font-medium">Illura Admin Panel</h1>
      </div>

      {/* Sidebar Menu */}
      <nav className="flex-grow px-3 py-4">
        {/* Menu Items */}
        <ul className="space-y-3">
          {/* Dashboard */}
          <li>
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full text-left px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition duration-150 text-sm"
            >
              Dashboard
            </button>
          </li>

          {/* Profiles */}
          <li>
            <button
              onClick={() => navigate("/profiledisplay")}
              className="w-full text-left px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition duration-150 text-sm"
            >
              Profiles
            </button>
          </li>

          {/* Tags */}
          <li>
            <button
              onClick={() => navigate("/tags")}
              className="w-full text-left px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition duration-150 text-sm"
            >
              Tags
            </button>
          </li>

          {/* Posts */}
          <li>
            <button
              onClick={() => alert("Navigating to Posts...")}
              className="w-full text-left px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition duration-150 text-sm"
            >
              Posts
            </button>
          </li>
        </ul>
      </nav>

      {/* Logout */}
      <div className="px-4 py-3 border-t border-gray-700">
        <button
          onClick={() => navigate("/loginadmin")}
          className="w-full text-left px-3 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-sm font-medium transition duration-150"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default SideAdmin;