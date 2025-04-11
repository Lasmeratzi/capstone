import React from "react";
import Sidebar from "../sidebar/sidebar"; // Ensure the path is correct
import MakePost from "../landing/makepost"; // Import MakePost component (adjust path if needed)
import Posts from "../landing/posts"; // Import Posts component (adjust path if needed)

const Home = () => {
  // Fetch fullname and username from localStorage
  const fullname = localStorage.getItem("fullname");
  const username = localStorage.getItem("username");

  // Create a loggedInUser object to pass to MakePost
  const loggedInUser = {
    id: localStorage.getItem("id"), // Retrieve the logged-in user's ID
    fullname: fullname,
    username: username,
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-20 h-screen fixed top-0 left-0 bg-white shadow-md z-10">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-grow ml-20 bg-gray-200">
        {/* Welcome Section */}
        <div className="p-4 bg-white shadow-md">
          <h2 className="text-lg font-semibold">
            Welcome, {fullname || username || "Guest"}!
          </h2>
        </div>

        {/* Post Creation Section */}
        <div className="px-4 py-0">
          <MakePost loggedInUser={loggedInUser} /> {/* Render the MakePost component */}
        </div>

        {/* Posts Feed Section */}
        <div className="px-4 py-4">
          <Posts /> {/* Render the Posts component */}
        </div>
      </div>
    </div>
  );
};

export default Home;