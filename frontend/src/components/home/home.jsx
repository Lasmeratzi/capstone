import React from "react";
import Sidebar from "../sidebar/sidebar"; // Ensure the path is correct

const Home = () => {
  // Fetch fullname and username from localStorage
  const fullname = localStorage.getItem("fullname");
  const username = localStorage.getItem("username");

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-grow flex flex-col bg-gray-200">
        {/* Welcome Section */}
        <div className="p-4 bg-white shadow-md">
          <h2 className="text-lg font-semibold">
            Welcome, {fullname || username || "Guest"}!
          </h2>
        </div>

        {/* Main Text */}
        <div className="flex-grow flex justify-center items-center">
          <h1 className="text-2xl font-bold">homepage works</h1>
        </div>
      </div>
    </div>
  );
};

export default Home;