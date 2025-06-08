import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Extract user ID from the URL
import axios from "axios";
import Sidebar from "../sidebar/sidebar"; // Include the sidebar for navigation
import VisitPortfolio from "./visitportfolio"; // Import VisitPortfolio component
import VisitPost from "./visitpost"; // Import VisitPost component for displaying visited user's posts
import VisitArt from "./visitart"; // Import VisitArt component for visited user's artwork
import VisitAuct from "./visitauct"; // Import VisitAuct component for visited user's auctions
import { UserIcon, CakeIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { NewspaperIcon, PhotoIcon, Squares2X2Icon, TagIcon } from "@heroicons/react/24/outline";

const VisitProfile = () => {
  const { id } = useParams(); // Extract user ID from URL parameters
  const [user, setUser] = useState(null); // State for user profile data
  const [loading, setLoading] = useState(true); // State for loading indication
  const [error, setError] = useState(null); // State for error handling
  const [activeTab, setActiveTab] = useState("posts"); // Default: Posts

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch user profile
        const response = await axios.get(`http://localhost:5000/api/profile/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        setError("Unable to fetch user profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-gray-500">Loading profile...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  if (!user) {
    return <div className="flex justify-center items-center h-screen text-gray-500">User not found.</div>;
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="fixed h-screen w-60">
        <Sidebar />
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="ml-60 flex-grow px-40 py-4"
      >
        {/* Profile Section */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start">
            <div className="w-32 flex flex-col items-center">
              <img src={`http://localhost:5000/uploads/${user.pfp}`} alt={`${user.username}'s Profile`} className="w-32 h-32 rounded-full object-cover shadow-lg border-2 border-gray-300" />

              {/* Commissions Status */}
              <div className="mt-2 text-center text-xs text-gray-700 font-medium">
                <span className="mr-1">Commissions:</span>
                <button className={`px-3 py-1 rounded-full shadow transition duration-300 ${
                  user.commissions === "open" ? "bg-green-500 text-white" : "bg-orange-500 text-white"
                }`} disabled>
                  {user.commissions === "open" ? "Open" : "Closed"}
                </button>
              </div>
            </div>

            <div className="ml-6 flex flex-col justify-between h-32">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">{user.username}</h2>
                <div className="flex items-center text-sm sm:text-lg text-gray-600 mt-1">
                  <UserIcon className="w-5 h-5 mr-2 text-gray-500" />
                  {user.fullname}
                </div>
                <div className="flex items-center text-xs sm:text-sm text-gray-500 mt-1">
                  <CakeIcon className="w-5 h-5 mr-2 text-gray-400" />
                  {new Date(user.birthdate).toLocaleDateString()}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-gray-700 italic max-w-xs overflow-hidden text-ellipsis">{user.bio ? `"${user.bio}"` : "No bio provided."}</p>
            </div>
          </div>
        </div>

        {/* Divider Line */}
        <div className="border-b border-gray-200 mb-4"></div>

        {/* Tabs: Posts, Portfolio, Art, Auction */}
        <div className="flex border-b border-gray-300 mb-6 text-sm">
          <button
            onClick={() => setActiveTab("posts")}
            className={`flex-1 text-center py-2 font-semibold flex items-center justify-center gap-2 ${
              activeTab === "posts"
                ? "border-b-4 border-blue-500 text-blue-600"
                : "hover:bg-gray-100 text-gray-600"
            }`}
          >
            <NewspaperIcon className="h-5 w-5" />
            Posts
          </button>

          <button
            onClick={() => setActiveTab("visitart")}
            className={`flex-1 text-center py-2 font-semibold flex items-center justify-center gap-2 ${
              activeTab === "visitart"
                ? "border-b-4 border-blue-500 text-blue-600"
                : "hover:bg-gray-100 text-gray-600"
            }`}
          >
            <PhotoIcon className="h-5 w-5" />
            Art
          </button>

          <button
            onClick={() => setActiveTab("portfolio")}
            className={`flex-1 text-center py-2 font-semibold flex items-center justify-center gap-2 ${
              activeTab === "portfolio"
                ? "border-b-4 border-blue-500 text-blue-600"
                : "hover:bg-gray-100 text-gray-600"
            }`}
          >
            <Squares2X2Icon className="h-5 w-5" />
            Portfolio
          </button>

          <button
            onClick={() => setActiveTab("visitauct")}
            className={`flex-1 text-center py-2 font-semibold flex items-center justify-center gap-2 ${
              activeTab === "visitauct"
                ? "border-b-4 border-blue-500 text-blue-600"
                : "hover:bg-gray-100 text-gray-600"
            }`}
          >
            <TagIcon className="h-5 w-5" />
            Auctions
          </button>
        </div>

        {/* Content Section */}
        {activeTab === "posts" && <VisitPost userId={user.id} />}
        {activeTab === "visitart" && <VisitArt userId={user.id} />}
        {activeTab === "portfolio" && <VisitPortfolio userId={user.id} />}
        {activeTab === "visitauct" && <VisitAuct userId={user.id} />}
      </motion.div>
    </div>
  );
};

export default VisitProfile;