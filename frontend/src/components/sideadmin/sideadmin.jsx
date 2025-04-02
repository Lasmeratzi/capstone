import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

const SideAdmin = () => {
  const navigate = useNavigate(); // Hook for navigation

  return (
    <div className="h-screen w-64 bg-gray-800 text-white flex flex-col">
      {/* Sidebar Header */}
      <div className="py-4 px-6 bg-gray-900">
        <h1 className="text-xl font-bold">Admin Panel</h1>
      </div>

      {/* Sidebar Menu */}
      <nav className="flex-grow px-4 py-6">
        {/* Dashboard */}
        <div className="mb-4">
          <button
            onClick={() => navigate("/dashboard")} // Redirect to Dashboard page
            className="w-full text-left px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
          >
            Dashboard
          </button>
        </div>

        {/* Profiles */}
        <div className="mb-4">
          <button
            onClick={() => alert("Navigating to Profiles...")}
            className="w-full text-left px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
          >
            Profiles
          </button>
        </div>

        {/* Tags */}
        <div className="mb-4">
          <button
            onClick={() => navigate("/tags")} // Redirect to Tags page
            className="w-full text-left px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
          >
            Tags
          </button>
        </div>

        {/* Posts */}
        <div className="mb-4">
          <button
            onClick={() => alert("Navigating to Posts...")}
            className="w-full text-left px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
          >
            Posts
          </button>
        </div>

        {/* Logout */}
        <div className="mt-auto">
          <button
            onClick={() => navigate("/loginadmin")} // Redirect to loginadmin
            className="w-full text-left px-4 py-2 bg-red-600 hover:bg-red-500 rounded"
          >
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
};

export default SideAdmin;