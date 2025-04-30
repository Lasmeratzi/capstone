import React from "react";
import Sidebar from "../sidebar/sidebar"; // Ensure the path is correct

const Home = () => {
  // Destructure user data from localStorage
  const fullname = localStorage.getItem("fullname") || "Guest";
  const username = localStorage.getItem("username") || "Unknown User";
  const userId = localStorage.getItem("id") || null; // Fallback if not logged in

  // Create a loggedInUser object for future use
  const loggedInUser = { id: userId, fullname, username };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar /> {/* Fixed sidebar */}

      {/* Main Content */}
      <div className="flex-grow ml-0 bg-gray-200"> {/* Adjusted margin-left to match sidebar width */}
        {/* Welcome Section */}
        <div className="p-4 bg-white shadow-md">
          <h2 className="text-lg font-semibold">
            Welcome, {fullname} ({username})!
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Home;
