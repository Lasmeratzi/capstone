import React from "react";
import { useNavigate } from "react-router-dom";

const SideAdmin = () => {
  const navigate = useNavigate();
  const adminRole = sessionStorage.getItem("adminRole"); // ✅ Fetch admin role

  // ✅ Set sidebar color based on role
  const sidebarColor = adminRole === "super_admin" ? "bg-black" : "bg-gray-900";

  const handleAdminLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/logout/admin", {
        method: "POST",
        headers: { Authorization: `Bearer ${sessionStorage.getItem("adminToken")}` }, // ✅ Use sessionStorage
      });

      const data = await response.json();
      console.log("Logout Response:", data);

      // ✅ Clear ALL admin credentials when logging out
      sessionStorage.removeItem("adminToken");
      sessionStorage.removeItem("adminRole");

      navigate("/loginadmin");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className={`h-screen w-48 ${sidebarColor} text-white flex flex-col shadow-lg`}>
      {/* Sidebar Header */}
      <div className="py-4 px-4 bg-gray-800 border-b border-gray-700 flex items-center">
        <img src="src/assets/images/illura.png" alt="Illura Logo" className="w-8 h-8 mr-2" />
        <h1 className="text-sm font-medium">Illura Admin Panel</h1>
      </div>

      {/* Sidebar Menu */}
      <nav className="flex-grow px-3 py-4">
        <ul className="space-y-3">
          <li>
            <button onClick={() => navigate("/dashboard")} className="w-full text-left px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition duration-150 text-sm">
              Dashboard
            </button>
          </li>
          <li>
            <button onClick={() => navigate("/displayprofile")} className="w-full text-left px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition duration-150 text-sm">
              Profiles
            </button>
          </li>
          <li>
            <button onClick={() => navigate("/tags")} className="w-full text-left px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition duration-150 text-sm">
              Tags
            </button>
          </li>
          <li>
            <button onClick={() => navigate("/displayposts")} className="w-full text-left px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition duration-150 text-sm">
              Posts
            </button>
          </li>

          {/* ✅ Auctions Button for Super Admins ONLY → Navigates to `/displayauctions` */}
          {adminRole === "super_admin" && (
            <li>
              <button onClick={() => navigate("/displayauctions")} className="w-full text-left px-3 py-2 bg-green-700 hover:bg-green-600 rounded-lg transition duration-150 text-sm">
                Manage Auctions
              </button>
            </li>
          )}
        </ul>
      </nav>

      {/* Logout */}
      <div className="px-4 py-3 border-t border-gray-700">
        <button onClick={handleAdminLogout} className="w-full text-left px-3 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-sm font-medium transition duration-150">
          Logout
        </button>
      </div>
    </div>
  );
};

export default SideAdmin;