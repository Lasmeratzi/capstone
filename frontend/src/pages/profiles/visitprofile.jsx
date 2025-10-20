import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "../sidebar/sidebar";
import VisitPortfolio from "./visitportfolio";
import VisitPost from "./visitpost";
import VisitArt from "./visitart";
import VisitAuct from "./visitauct";
import { CakeIcon, NewspaperIcon, PhotoIcon, Squares2X2Icon, TagIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { FaInstagram, FaFacebook } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { FaPaintBrush, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import FollowButton from "../follow/followbutton";
import FollowStats from "../follow/followstats";

const VerifiedBadge = () => (
  <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500">
    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  </div>
);

const VisitProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");
  const [refreshStats, setRefreshStats] = useState(false);
  const [locations, setLocations] = useState([]);

  const handleRefreshStats = () => setRefreshStats(prev => !prev);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
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

    const fetchLocations = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/locations`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const locationsData = Array.isArray(res.data) ? res.data : res.data.locations || [];
        setLocations(locationsData);
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      }
    };

    fetchUserProfile();
    fetchLocations();
  }, [id]);

  // Get user's location display text
  const getUserLocation = () => {
    if (!user || !user.location_id) return null;
    
    const location = locations.find(loc => loc.id === Number(user.location_id));
    if (!location) return null;
    
    return `${location.name}, ${location.province}`;
  };

  const userLocation = getUserLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        User not found.
      </div>
    );
  }

  return (
    <div className="flex">
      <div className="fixed h-screen w-60">
        <Sidebar />
      </div>

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="ml-50 flex-grow px-6 py-4"
      >
        {/* Profile Section */}
        <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-4 mb-4">
          {/* Profile Picture + Commissions */}
          <div className="w-32 flex flex-col items-center mx-auto sm:mx-0">
            <div className="relative">
              <img
                src={`http://localhost:5000/uploads/${user.pfp}`}
                alt={`${user.username}'s Profile`}
                className="w-32 h-32 rounded-full object-cover shadow-lg border-2 border-gray-300"
              />
            </div>
            <div className="mt-2 flex flex-col items-center">
              <div className="flex items-center text-gray-600 font-medium text-xs uppercase tracking-wider mb-1">
                <FaPaintBrush className="mr-1.5 text-gray-400" size={12} />
                <span>Commissions</span>
              </div>
              <div
                className={`px-4 py-1.5 rounded-full flex items-center gap-2 shadow-sm ${
                  user.commissions === "open"
                    ? "bg-green-500 text-white"
                    : "bg-rose-500 text-white"
                }`}
              >
                {user.commissions === "open" ? (
                  <>
                    <FaCheckCircle size={14} />
                    <span className="text-sm font-medium">Open</span>
                  </>
                ) : (
                  <>
                    <FaTimesCircle size={14} />
                    <span className="text-sm font-medium">Closed</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="flex flex-col space-y-1">
            <div className="flex items-center flex-wrap gap-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">{user.username}</h2>
              {user.isVerified && (
                <span title="Verified" className="text-blue-500">
                  <VerifiedBadge />
                </span>
              )}
              <FollowButton targetUserId={user.id} />
              {/* Follow Stats - Placed right below the username row */}
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-1">
                <FollowStats targetUserId={user.id} />
              </div>
            </div>
            <div className="text-xl text-gray-600">{user.fullname}</div>

            <div className="flex items-center text-sm text-gray-500">
              <CakeIcon className="w-5 h-5 mr-2 text-gray-400" />
              {new Date(user.birthdate).toLocaleDateString()}
            </div>

            <p className="text-sm text-gray-700 italic max-w-xl overflow-hidden text-ellipsis">
              {user.bio ? `"${user.bio}"` : "No bio provided."}
            </p>

            {/* Location Display - Moved below bio */}
            {userLocation && (
              <div className="flex items-center text-sm text-gray-600">
                <MapPinIcon className="w-4 h-4 mr-2 text-gray-500" />
                <span className="font-medium text-gray-700">
                  {userLocation.split(', ')[0]}, <span className="text-gray-500">{userLocation.split(', ')[1]}</span>
                </span>
              </div>
            )}

            <div className="text-xs mt-1">
              {user.verification_request_status === "pending" && (
                <p className="text-yellow-500">Verification under review</p>
              )}
              {user.verification_request_status === "rejected" && (
                <p className="text-red-500">Verification request rejected</p>
              )}
            </div>

            {user.isVerified && (
              <div className="flex gap-3 mt-1">
                {user.twitter_link && (
                  <a href={user.twitter_link} target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-700">
                    <FaXTwitter size={20} />
                  </a>
                )}
                {user.instagram_link && (
                  <a href={user.instagram_link} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-500">
                    <FaInstagram size={20} />
                  </a>
                )}
                {user.facebook_link && (
                  <a href={user.facebook_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500">
                    <FaFacebook size={20} />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="border-b border-gray-200 mb-4"></div>

        {/* Tabs */}
        <div className="flex border-b border-gray-300 mb-4 text-sm">
          {[
            { key: "posts", icon: NewspaperIcon, label: "Posts" },
            { key: "visitart", icon: PhotoIcon, label: "Art" },
            { key: "portfolio", icon: Squares2X2Icon, label: "Portfolio" },
            { key: "visitauct", icon: TagIcon, label: "Auctions" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 text-center py-2 font-semibold flex items-center justify-center gap-2 ${
                activeTab === tab.key
                  ? "border-b-4 border-blue-500 text-blue-600"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              <tab.icon className="h-5 w-5" />
              {tab.label}
            </button>
          ))}
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