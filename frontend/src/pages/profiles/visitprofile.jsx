import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom"; // UPDATED: Added useSearchParams
import axios from "axios";
import Sidebar from "../sidebar/sidebar";
import VisitPortfolio from "./visitportfolio";
import VisitPost from "./visitpost";
import VisitArt from "./visitart";
import VisitAuct from "./visitauct";
import { 
  CakeIcon, 
  NewspaperIcon, 
  PhotoIcon, 
  Squares2X2Icon, 
  TagIcon, 
  MapPinIcon, 
  CameraIcon,
  CheckIcon,
  PencilSquareIcon
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { FaInstagram, FaFacebook } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { FaPaintBrush, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import FollowButton from "../follow/followbutton";
import FollowStats from "../follow/followstats";
import ProfileInfo from "../../components/profile/ProfileInfo";
import ProfileHeader from "../../components/profile/ProfileHeader";
import MobileNav from "../../components/layout/MobileNav";

const BASE_URL = "http://localhost:5000";

const VerifiedBadge = () => (
  <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500">
    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  </div>
);

// Protected Image Component for watermark (if needed)
const ProtectedWatermarkImage = ({ src, alt, className, onError }) => {
  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  const handleDragStart = (e) => {
    e.preventDefault();
  };

  return (
    <div className="relative inline-block">
      <img
        src={src}
        alt={alt}
        className={className}
        onError={onError}
        onContextMenu={handleContextMenu}
        onDragStart={handleDragStart}
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
        }}
      />
      <div 
        className="absolute inset-0 cursor-not-allowed"
        style={{ pointerEvents: 'auto' }}
        onContextMenu={handleContextMenu}
        onDragStart={handleDragStart}
      />
    </div>
  );
};

const VisitProfile = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams(); // ADDED: Get URL parameters
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get tab from URL or default to "posts"
  const tabFromURL = searchParams.get("tab") || "posts";
  const [activeTab, setActiveTab] = useState(tabFromURL); // UPDATED: Use URL tab
  
  const [refreshStats, setRefreshStats] = useState(false);
  const [locations, setLocations] = useState([]);
  const [coverImageLoadError, setCoverImageLoadError] = useState(false);
  const [isWatermarkVisible, setIsWatermarkVisible] = useState(false);

  const handleRefreshStats = () => setRefreshStats(prev => !prev);

  const coverPhotoUrl = (filename) => {
    if (!filename) return null;
    const timestamp = new Date().getTime();
    return `${BASE_URL}/uploads/cover_photos/${encodeURIComponent(filename)}?t=${timestamp}`;
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BASE_URL}/api/profile/${id}`, {
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
        const res = await axios.get(`${BASE_URL}/api/locations`, {
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
      {/* Mobile Navigation */}
      <MobileNav />

      <div className="hidden md:block fixed h-screen w-50">
        <Sidebar />
      </div>

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="ml-0 md:ml-50 flex-grow px-4 md:px-6 pt-16 md:pt-0 pb-20 md:pb-0 bg-white dark:bg-[#0A0A0B] min-h-screen overflow-x-hidden"
      >
        {/* Profile Header with Cover Photo Background */}
        <ProfileHeader
          coverPhoto={user.cover_photo}
          coverPhotoUrl={coverPhotoUrl}
          onCoverImageError={() => setCoverImageLoadError(true)}
        >
          {/* Mobile Header Layout (PFP + Name side by side) */}
          <div className="flex lg:hidden items-center gap-4 mb-6">
            <div className="w-24 flex flex-col items-center">
              <img
                src={`${BASE_URL}/uploads/${user.pfp}`}
                alt={`${user.username}'s Profile`}
                className="w-24 h-24 rounded-full object-cover shadow-lg border-4 border-white dark:border-[#0A0A0B] transition-all duration-300"
              />
            </div>
            <ProfileInfo
              user={user}
              CheckIcon={CheckIcon}
              variant="header"
              locations={locations}
              followButton={<FollowButton targetUserId={user.id} onFollowChange={handleRefreshStats} />}
              refreshTrigger={refreshStats}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr_auto] gap-6 items-start">
            {/* Column 1: Profile Picture + Commissions (Desktop) */}
            <div className="hidden lg:flex w-24 sm:w-32 flex-col items-center mx-auto sm:mx-0">
              <div className="relative">
                <img
                  src={`${BASE_URL}/uploads/${user.pfp}`}
                  alt={`${user.username}'s Profile`}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover shadow-lg border-4 border-white dark:border-[#0A0A0B] transition-all duration-300"
                />
              </div>

              {/* Commissions Button */}
              <div className="mt-3 flex flex-col items-center">
                <div className="flex items-center text-current dark:text-current font-medium text-xs uppercase tracking-wider mb-1">
                  <FaPaintBrush className="mr-1.5 text-current dark:text-current" size={12} />
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

            {/* Column 2: Profile Details */}
            <div className="flex flex-col space-y-4">
              <ProfileInfo
                user={user}
                CheckIcon={CheckIcon}
                locations={locations}
                followButton={<FollowButton targetUserId={user.id} onFollowChange={handleRefreshStats} />}
                refreshTrigger={refreshStats}
              />

              {/* Mobile Commissions & Actions */}
              <div className="flex lg:hidden flex-col gap-3 mt-4">
                <div className="flex items-center gap-2">
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
                        <span className="font-semibold text-sm">Commissions: Open</span>
                      </>
                    ) : (
                      <>
                        <FaTimesCircle size={14} />
                        <span className="font-semibold text-sm">Commissions: Closed</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <FollowButton targetUserId={user.id} onFollowChange={handleRefreshStats} />
                  <div className="flex items-center gap-4 text-sm text-current dark:text-current">
                    <FollowStats targetUserId={user.id} refreshTrigger={refreshStats} />
                  </div>
                </div>
              </div>

              {/* Watermark Toggle (Mobile) */}
              <button
                onClick={() => setIsWatermarkVisible(!isWatermarkVisible)}
                className="lg:hidden flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-lg backdrop-blur-md border border-white/20 transition-all mt-2"
              >
                <CameraIcon className="w-4 h-4" />
                {isWatermarkVisible ? "Hide Artist Branding" : "View Artist Branding"}
              </button>
            </div>

            {/* Column 3: Watermark Display */}
            <div className={`${isWatermarkVisible ? 'block' : 'hidden'} lg:block`}>
              {user.watermark_path && (
                <div className="w-40 flex flex-col items-center space-y-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="w-full">
                    <h3 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 text-center">
                      Artist Watermark
                    </h3>
                    <div className="flex flex-col items-center">
                      <ProtectedWatermarkImage
                        src={`${BASE_URL}/uploads/watermarks/${user.watermark_path}?t=${new Date().getTime()}`}
                        alt="User Watermark"
                        className="w-24 h-24 object-contain rounded-lg shadow-inner bg-white/10"
                        onError={() => console.log("Watermark load error")}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </ProfileHeader>
        
        <div className="border-b border-gray-200 dark:border-white/5 mb-4"></div>

        {/* Tabs Section - Polished Style */}
        <div className="flex border-b border-gray-200 dark:border-white/5 mb-8 text-sm overflow-x-auto no-scrollbar">
          {[
            { key: "posts", icon: NewspaperIcon, label: "Posts" },
            { key: "visitart", icon: PhotoIcon, label: "Art Posts" },
            { key: "portfolio", icon: Squares2X2Icon, label: "Gallery" },
            { key: "visitauct", icon: TagIcon, label: "Auctions" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 min-w-[120px] py-4 font-bold flex items-center justify-center gap-2 transition-all duration-300 relative cursor-pointer ${
                activeTab === tab.key
                  ? "text-[#5E66FF]"
                  : "text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"
              }`}
            >
              <tab.icon className={`h-5 w-5 transition-transform duration-300 ${activeTab === tab.key ? "scale-110" : "scale-100"}`} />
              <span className="tracking-tight">{tab.label}</span>
              
              {activeTab === tab.key && (
                <motion.div 
                  layoutId="activeVisitTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#5E66FF]"
                  initial={false}
                />
              )}
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