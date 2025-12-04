import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Tag, 
  FileText, 
  Gavel, 
  ShieldCheck, 
  LogOut
} from "lucide-react";

const SideAdmin = () => {
  const navigate = useNavigate();
  const adminRole = sessionStorage.getItem("adminRole");

  const sidebarColor = adminRole === "super_admin" ? "bg-gray-900" : "bg-gray-900";

  const handleAdminLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/logout/admin", {
        method: "POST",
        headers: { Authorization: `Bearer ${sessionStorage.getItem("adminToken")}` },
      });

      const data = await response.json();
      console.log("Logout Response:", data);

      sessionStorage.removeItem("adminToken");
      sessionStorage.removeItem("adminRole");

      navigate("/loginadmin");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navItems = [
    { path: "/homeadmin", label: "Dashboard", icon: LayoutDashboard, color: "gray" },
    { path: "/displayprofile", label: "Profiles", icon: Users, color: "gray" },
    { path: "/tags", label: "Tags", icon: Tag, color: "gray" },
    { path: "/displayposts", label: "Posts", icon: FileText, color: "gray" },
  ];

  const superAdminItems = [
    { path: "/displayauctions", label: "Manage Auctions", icon: Gavel, color: "green" },
    { path: "/verifyprofile", label: "Verification Requests", icon: ShieldCheck, color: "blue" },
  ];

  const getButtonClass = (color) => {
    const baseClasses = "w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-3 group";
    const colorClasses = {
      gray: "bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white",
      green: "bg-green-900/50 hover:bg-green-800 text-green-200 hover:text-white border border-green-800/50",
      blue: "bg-blue-900/50 hover:bg-blue-800 text-blue-200 hover:text-white border border-blue-800/50",
      red: "bg-gray-800 hover:bg-red-600 text-gray-200 hover:text-white border border-red-700/50"
    };
    return `${baseClasses} ${colorClasses[color]}`;
  };

  return (
    <div className={`h-screen w-48 ${sidebarColor} text-white flex flex-col shadow-xl border-r-2 border-gray-700`}>
      {/* Header */}
      <div className="py-5 px-4 bg-gray-800/50 border-b border-gray-700 flex items-center space-x-3">
        <img src="src/assets/images/illura.png" alt="Illura Logo" className="w-6 h-6" />
        <div>
          <h1 className="text-sm font-semibold text-gray-100">Illura Admin</h1>
          <p className="text-xs text-gray-400 capitalize">{adminRole?.replace('_', ' ')}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-grow px-3 py-6">
        <ul className="space-y-1.5">
          {navItems.map((item) => (
            <li key={item.path}>
              <button 
                onClick={() => navigate(item.path)} 
                className={getButtonClass(item.color)}
              >
                <item.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
          
          {adminRole === "super_admin" && superAdminItems.map((item) => (
            <li key={item.path}>
              <button 
                onClick={() => navigate(item.path)} 
                className={getButtonClass(item.color)}
              >
                <item.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-gray-800">
        <button 
          onClick={handleAdminLogout} 
          className={getButtonClass("red")}
        >
          <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default SideAdmin;