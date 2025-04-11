import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import Sidebar from "../sidebar/sidebar"; // Ensure the path is correct
import axios from "axios";

const Profiles = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize navigation hook

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token for authenticated requests
        const username = localStorage.getItem("username"); // Get username from localStorage

        if (!token || !username) {
          setError("User not logged in");
          navigate("/login"); // Redirect to login if user is not logged in
          return;
        }

        // Replace this endpoint with your actual backend route
        const response = await axios.get(`http://localhost:5000/api/profiles/${username}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = response.data;

        // Check account status and handle "on_hold" case
        if (user.account_status === "on_hold") {
          alert("Your account is currently on hold. Please contact support for assistance.");
          localStorage.clear(); // Clear localStorage
          navigate("/login"); // Redirect back to login page
          return;
        }

        setUserInfo(user); // Save the user info in state
      } catch (err) {
        console.error("Error fetching user info:", err.response || err.message);
        setError("Failed to fetch user info");
      }
    };

    fetchUserInfo();
  }, [navigate]);

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
      <div className="flex-grow p-6 bg-gray-200 flex flex-col items-start">
        {error && <p className="text-red-600">{error}</p>}

        {userInfo ? (
          <div className="bg-white p-6 shadow-lg rounded-lg w-full max-w-md">
            {/* Profile Picture */}
            <div className="mb-4">
              <img
                src={`http://localhost:5000/uploads/${userInfo.pfp}`} // Ensure backend serves files correctly
                alt={`${userInfo.username}'s profile`}
                className="w-32 h-32 rounded-full object-cover"
              />
            </div>

            {/* User Info */}
            <div>
              {/* Full Name */}
              <h2 className="text-lg font-medium text-gray-700">{userInfo.fullname || "No full name available"}</h2>

              {/* Username with Larger Text */}
              <p className="text-2xl font-bold text-gray-900 mt-1">{userInfo.username}</p>

              {/* Bio */}
              <p className="text-gray-600 mt-2">
                <strong>Bio:</strong> {userInfo.bio || "No bio available"}
              </p>

              {/* Smaller Birthdate */}
              <p className="text-sm text-gray-500 mt-2">
                <strong>Birthdate:</strong> {formatBirthdate(userInfo.birthdate)}
              </p>

              {/* Smaller Email */}
              <p className="text-sm text-gray-500 mt-2">
                <strong>Email:</strong> {userInfo.email}
              </p>
            </div>
          </div>
        ) : (
          !error && <p>Loading profile...</p>
        )}
      </div>
    </div>
  );
};

export default Profiles;