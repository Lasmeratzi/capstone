import React from "react";
import SideAdmin from "../sideadmin/sideadmin"; // Adjust the path based on your project structure

const HomeAdmin = () => {
  return (
    <div className="flex">
      {/* Sidebar Component */}
      <SideAdmin />

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center bg-gray-100">
        <h1 className="text-3xl font-bold text-gray-800">Admin Home Works</h1>
      </div>
    </div>
  );
};

export default HomeAdmin;