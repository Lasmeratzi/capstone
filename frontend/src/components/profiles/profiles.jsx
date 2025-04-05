import React, { useEffect, useState } from "react";
import Sidebar from "../sidebar/sidebar"; // Ensure the path is correct
import axios from "axios";

const Profiles = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token for authenticated requests
        const username = localStorage.getItem("username"); // Get username from localStorage

        if (!token || !username) {
          setError("User not logged in");
          return;
        }

        // Replace this endpoint with your actual backend route
        const response = await axios.get(`http://localhost:5000/api/profiles/${username}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserInfo(response.data); // Save the user info in state
      } catch (err) {
        console.error("Error fetching user info:", err.response || err.message);
        setError("Failed to fetch user info");
      }
    };

    fetchUserInfo();
  }, []);

  // Helper function to format the birthdate
  const formatBirthdate = (birthdate) => {
    if (!birthdate) return "No birthdate available";

    const date = new Date(birthdate); // Parse the birthdate string into a Date object
    return new Intl.DateTimeFormat("en-US", {
      month: "long", // Full month name
      day: "numeric", // Day of the month
      year: "numeric", // Full year
    }).format(date);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center bg-gray-200 p-6">
        <h1 className="text-3xl font-bold mb-6">Profile</h1>

        {error && <p className="text-red-600">{error}</p>}

        {userInfo ? (
          <div className="bg-white p-6 shadow-lg rounded-lg w-full max-w-md">
            {/* Profile Picture */}
            <div className="flex justify-center mb-4">
              <img
                src={`http://localhost:5000/uploads/${userInfo.pfp}`} // Ensure backend serves files correctly
                alt={`${userInfo.username}'s profile`}
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
              />
            </div>

            {/* Username */}
            <h2 className="text-xl font-semibold text-center">{userInfo.username}</h2>

            {/* Email */}
            <p className="text-gray-600 text-center mt-2">
              <strong>Email:</strong> {userInfo.email}
            </p>

            {/* Bio */}
            <p className="text-gray-600 text-center mt-2">
              <strong>Bio:</strong> {userInfo.bio || "No bio available"}
            </p>

            {/* Birthdate */}
            <p className="text-gray-600 text-center mt-2">
              <strong>Birthdate:</strong> {formatBirthdate(userInfo.birthdate)}
            </p>
          </div>
        ) : (
          !error && <p>Loading profile...</p>
        )}
      </div>
    </div>
  );
};

export default Profiles;