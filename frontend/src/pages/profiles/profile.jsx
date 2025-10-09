import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../sidebar/sidebar";
import PortfolioGrid from "../profiles/portfoliogrid";
import PortfolioUpload from "../portfolioupload/portfolioupload";
import VerifyRequest from "../verifyrequest/verifyrequest";
import OwnPost from "../profiles/ownpost";
import OwnArt from "../profiles/ownart";
import OwnAuct from "../profiles/ownauct";
import {
  PlusCircleIcon,
  CakeIcon,
  PencilSquareIcon,
  NewspaperIcon,
  PhotoIcon,
  Squares2X2Icon,
  TagIcon,
  BoltIcon,
  CheckIcon,
  XMarkIcon,
  ShieldCheckIcon,
  TrashIcon,
  CloudArrowUpIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import Wallet from "../wallet/wallet";
import { FaInstagram, FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaPaintBrush, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import FollowStats from "../follow/followstats";

const BASE_URL = "http://localhost:5000";

const VerifiedBadge = () => (
  <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500">
    <CheckIcon className="w-3 h-3 text-white" />
  </div>
);

const Profile = () => {
  const [user, setUser] = useState(null);
  const [commissions, setCommissions] = useState("closed");
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editPfp, setEditPfp] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Watermark state
  const [watermark, setWatermark] = useState(null); // server filename (watermark_path)
  const [watermarkFile, setWatermarkFile] = useState(null); // File selected by user
  const [previewUrl, setPreviewUrl] = useState(null); // local preview url for selected file
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchPortfolio();
    // cleanup when component unmounts
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch profile (logged-in user)
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const userResponse = await axios.get(`${BASE_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = userResponse.data;
      // server returns watermark_path in profileController
      const wm = userData.watermark_path ?? userData.watermark ?? null;
      setUser(userData);
      setCommissions(userData.commissions);
      setWatermark(wm);
      setImageLoadError(false);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  const fetchPortfolio = async () => {
    try {
      const token = localStorage.getItem("token");
      const portfolioResponse = await axios.get(`${BASE_URL}/api/portfolio`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPortfolioItems(portfolioResponse.data);
    } catch (error) {
      console.error("Failed to fetch portfolio items:", error);
    }
  };

  const toggleCommissions = async () => {
    const token = localStorage.getItem("token");
    const newStatus = commissions === "closed" ? "open" : "closed";

    try {
      await axios.patch(
        `${BASE_URL}/api/profile/commissions`,
        { commissions: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCommissions(newStatus);
    } catch (error) {
      console.error("Failed to update commissions status:", error);
    }
  };

  const toggleUploadModal = () => setIsUploadModalOpen(!isUploadModalOpen);
  const toggleVerifyModal = () => setIsVerifyModalOpen(!isVerifyModalOpen);

  const startEditing = () => {
    setIsEditing(true);
    setEditUsername(user.username);
    setEditBio(user.bio || "");
    setEditPfp(null);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("username", editUsername);
    formData.append("bio", editBio);
    if (editPfp) formData.append("pfp", editPfp);

    try {
      await axios.patch(`${BASE_URL}/api/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // refresh profile after update
      await fetchProfile();
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePfpChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditPfp(file);
    }
  };

  // Watermark file selection (for preview before upload)
  const handleWatermarkSelect = (file) => {
    if (!file) return;
    // Only allow PNG (but server may accept other types)
    // You can validate file.type === 'image/png' if you want strict enforcement
    setWatermarkFile(file);
    // create preview URL (revoke previous)
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setImageLoadError(false);
  };

  // Upload watermark to server
  const handleWatermarkUpload = async () => {
    if (!watermarkFile) return;
    setIsUploading(true);
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("watermark", watermarkFile);

    try {
      const resp = await axios.post(`${BASE_URL}/api/profile/watermark`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // server returns watermark_path
      const serverFilename = resp.data?.watermark_path ?? resp.data?.watermark ?? null;
      if (serverFilename) {
        setWatermark(serverFilename);
      } else {
        // fallback: re-fetch profile to get DB value
        await fetchProfile();
      }
      // cleanup preview and selected file
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      setWatermarkFile(null);
    } catch (error) {
      console.error("Failed to upload watermark:", error);
    } finally {
      setIsUploading(false);
    }
  };

  // Cancel selected file (before upload)
  const handleCancelSelection = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setWatermarkFile(null);
  };

  // Delete watermark
  const handleDeleteWatermark = async () => {
    if (!watermark) return;
    setIsDeleting(true);
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${BASE_URL}/api/profile/watermark`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWatermark(null);
      // cleanup preview if any
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      setWatermarkFile(null);
      // refresh profile
      await fetchProfile();
    } catch (error) {
      console.error("Failed to delete watermark:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // helper to render watermark image URL (encode filename)
  const watermarkUrl = (filename) => {
    if (!filename) return null;
    // encodeURIComponent to safely include spaces/special chars
    return `${BASE_URL}/uploads/watermarks/${encodeURIComponent(filename)}`;
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading...
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
        {/* Profile Header */}
        <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-6 mb-4">
          {/* Profile Picture + Commissions */}
          <div className="w-32 flex flex-col items-center mx-auto sm:mx-0">
            <div className="relative group">
              <img
                src={
                  editPfp
                    ? URL.createObjectURL(editPfp)
                    : `${BASE_URL}/uploads/${user.pfp}`
                }
                alt={`${user.username}'s Profile`}
                className="w-32 h-32 rounded-full object-cover shadow-lg border-2 border-gray-300 transition-all duration-300"
              />
              {isEditing && (
                <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer transition-opacity opacity-0 group-hover:opacity-100">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePfpChange}
                    className="hidden"
                  />
                  <span className="text-white text-sm font-medium">
                    Change Photo
                  </span>
                </label>
              )}
            </div>

            {/* Commissions Button */}
            <div className="mt-3 flex flex-col items-center">
              <div className="flex items-center text-gray-600 font-medium text-xs uppercase tracking-wider mb-1">
                <FaPaintBrush className="mr-1.5 text-gray-400" size={12} />
                <span>Commissions</span>
              </div>
              <button
                onClick={toggleCommissions}
                className={`px-4 py-1.5 rounded-full flex items-center gap-2 shadow-sm transition-all duration-200 ${
                  commissions === "open"
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : "bg-rose-500 hover:bg-rose-600 text-white"
                }`}
              >
                {commissions === "open" ? (
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
              </button>
            </div>

            {/* Watermark Management (Add / Replace / Delete) */}
            <div className="mt-6 w-full text-center">
              <h3 className="text-xs font-semibold text-gray-600 uppercase mb-2">
                Watermark
              </h3>

              {/* If user selected a file but not uploaded yet, show local preview */}
              {previewUrl ? (
                <div className="flex flex-col items-center space-y-2">
                  <img
                    src={previewUrl}
                    alt="Watermark Preview (local)"
                    className="w-20 h-20 object-contain border rounded-md shadow-sm bg-white"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleWatermarkUpload}
                      disabled={isUploading}
                      className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700"
                    >
                      <CloudArrowUpIcon className="w-4 h-4" />
                      {isUploading ? "Uploading..." : "Upload"}
                    </button>
                    <button
                      onClick={handleCancelSelection}
                      className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : watermark ? (
                // If a watermark exists on server, show it and provide Replace/Delete controls
                <div className="flex flex-col items-center space-y-2">
                  <img
                    src={watermarkUrl(watermark)}
                    alt="Watermark Preview"
                    crossOrigin="anonymous"
                    onError={() => setImageLoadError(true)}
                    className={`w-20 h-20 object-contain border rounded-md shadow-sm bg-white ${
                      imageLoadError ? "hidden" : ""
                    }`}
                  />
                  {imageLoadError && (
                    <div className="text-xs text-red-500">Preview unavailable</div>
                  )}
                  <div className="flex gap-2">
                    <label className="cursor-pointer text-xs text-blue-600 hover:underline flex items-center gap-1">
                      <input
                        type="file"
                        accept="image/png"
                        className="hidden"
                        onChange={(e) => handleWatermarkSelect(e.target.files[0])}
                      />
                      <CloudArrowUpIcon className="w-4 h-4" />
                      Replace
                    </label>

                    <button
                      onClick={handleDeleteWatermark}
                      disabled={isDeleting}
                      className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600"
                    >
                      <TrashIcon className="w-4 h-4" />
                      {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              ) : (
                // No watermark on server & no local selection yet
                <div className="flex flex-col items-center space-y-2">
                  <label className="cursor-pointer text-blue-600 hover:underline text-xs">
                    <input
                      type="file"
                      accept="image/png"
                      className="hidden"
                      onChange={(e) => handleWatermarkSelect(e.target.files[0])}
                    />
                    {watermarkFile ? watermarkFile.name : "Choose PNG File"}
                  </label>
                  <button
                    onClick={handleWatermarkUpload}
                    disabled={!watermarkFile || isUploading}
                    className={`flex items-center gap-1 text-xs ${
                      isUploading
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-green-600 hover:text-green-700"
                    }`}
                  >
                    <CloudArrowUpIcon className="w-4 h-4" />
                    {isUploading ? "Uploading..." : "Upload"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Profile Details */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center flex-wrap gap-2">
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    className="text-2xl sm:text-3xl font-bold text-gray-800 bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none px-1 py-0.5"
                  />
                ) : (
                  <>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                      {user.username}
                    </h2>
                    {user.isVerified && (
                      <span title="Verified" className="text-blue-500">
                        <VerifiedBadge />
                      </span>
                    )}
                  </>
                )}
              </div>
              {!isEditing && (
                <>
                  <button
                    onClick={startEditing}
                    className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                    title="Edit Profile"
                  >
                    <PencilSquareIcon className="w-5 h-5" />
                  </button>
                  <FollowStats targetUserId={user.id} />
                </>
              )}
            </div>

            <div className="text-xl text-gray-600">{user.fullname}</div>

            <div className="flex items-center text-sm text-gray-500">
              <CakeIcon className="w-5 h-5 mr-2 text-gray-400" />
              {new Date(user.birthdate).toLocaleDateString()}
            </div>

            {isEditing ? (
              <textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                className="text-sm text-gray-700 bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none px-1 py-0.5 resize-none"
                placeholder="Tell us about yourself..."
                rows="2"
              />
            ) : (
              <p className="text-sm text-gray-700 italic max-w-xl overflow-hidden text-ellipsis">
                {user.bio ? `"${user.bio}"` : "No bio provided."}
              </p>
            )}

            <div className="text-xs mt-1">
              {user.verification_request_status === "pending" && (
                <p className="text-yellow-500">Your verification is under review.</p>
              )}
              {user.verification_request_status === "rejected" && (
                <p className="text-red-500">Your verification request was rejected.</p>
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

        {/* Edit Buttons */}
        {isEditing && (
          <div className="flex justify-start space-x-3 mb-4">
            <button
              onClick={handleProfileUpdate}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow transition-all"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <CheckIcon className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
            <button
              onClick={cancelEditing}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium rounded-md shadow transition-all"
            >
              <XMarkIcon className="h-4 w-4 inline mr-1" />
              Cancel
            </button>
          </div>
        )}

        {/* Buttons (Portfolio & Verify) */}
        {!isEditing && (
          <div className="flex justify-start mb-4 gap-3">
            <button onClick={toggleUploadModal} className="flex items-center gap-3 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-md transition-all duration-300 ease-in-out">
              <PlusCircleIcon className="h-5 w-5" />
              <span className="text-sm">Portfolio</span>
            </button>
            {!user.isVerified && (
              <button onClick={toggleVerifyModal} className="flex items-center gap-3 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md shadow-md transition-all duration-300 ease-in-out">
                <ShieldCheckIcon className="h-5 w-5" />
                <span className="text-sm">Verify Account</span>
              </button>
            )}
          </div>
        )}

        <div className="border-b border-gray-200 mb-4"></div>

        {/* Tabs Section */}
        <div className="flex border-b border-gray-300 mb-6 text-sm">
          {[
            { key: "posts", icon: NewspaperIcon, label: "Posts" },
            { key: "ownart", icon: PhotoIcon, label: "Own Art" },
            { key: "portfolio", icon: Squares2X2Icon, label: "Portfolio" },
            { key: "ownauct", icon: TagIcon, label: "Own Auction" },
            { key: "wallet", icon: BoltIcon, label: "Wallet" },
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

        {/* Tab Content */}
        {activeTab === "posts" && <OwnPost userId={user.id} />}
        {activeTab === "ownart" && <OwnArt userId={user.id} />}
        {activeTab === "portfolio" && (
          <PortfolioGrid portfolioItems={portfolioItems} loggedInUserId={user.id} />
        )}
        {activeTab === "ownauct" && <OwnAuct userId={user.id} />}
        {activeTab === "wallet" && <Wallet />}

        {/* Upload Modal */}
        {isUploadModalOpen && (
          <div className="fixed inset-0 bg-gray-950/90 backdrop-blur-md flex justify-center items-center z-50 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]">
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-lg w-full relative mx-4 my-8">
              <button onClick={toggleUploadModal} className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-2xl">&times;</button>
              <PortfolioUpload onSuccess={toggleUploadModal} />
            </div>
          </div>
        )}

        {/* Verify Modal */}
        {isVerifyModalOpen && (
          <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-lg flex justify-center items-center z-50 transition-all duration-300 ease-out">
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-lg w-full relative mx-4 my-8">
              <button onClick={toggleVerifyModal} className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-2xl">&times;</button>
              <VerifyRequest onSuccess={toggleVerifyModal} />
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Profile;
