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

        {/* Post Input Section */}
        <div className="flex justify-center items-center mt-4">
          <div className="w-full max-w-[600px] space-y-6">
            {/* Post Input */}
            <div className="bg-gray-300 p-4 shadow-md border border-gray-500">
              <p>Post something...</p>
              <div className="flex space-x-2 mt-2">
                <button className="bg-blue-600 text-white px-4 py-1 border border-black">
                  Photo/Video
                </button>
                <button className="bg-blue-600 text-white px-4 py-1 border border-black">
                  GIF
                </button>
              </div>
            </div>

            {/* Feed Posts */}
            <div className="bg-gray-400 h-64 shadow-md border border-gray-500"></div>
            <div className="bg-gray-400 h-32 shadow-md border border-gray-500"></div>
          </div>
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
