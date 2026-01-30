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
  CheckIcon,
  XMarkIcon,
  ShieldCheckIcon,
  TrashIcon,
  CloudArrowUpIcon,
  MapPinIcon,
  ChevronDownIcon, 
  CameraIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { FaInstagram, FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaPaintBrush, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import FollowStats from "../follow/followstats";

// Custom hooks
import { useProfile } from "../../hooks/useProfile";
import { useWatermark } from "../../hooks/useWatermark";
import { useCoverPhoto } from "../../hooks/useCoverPhoto";

// Components
import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileInfo from "../../components/profile/ProfileInfo";
import ProfilePictureSection from "../../components/profile/ProfilePictureSection";
import ActionButtons from "../../components/profile/ActionButtons";
import WatermarkSection from "../../components/profile/WatermarkSection";
import SocialMediaModal from "../../components/modals/socialmediamodal"; // NEW IMPORT

const BASE_URL = "http://localhost:5000";

// URL functions that need BASE_URL
const coverPhotoUrl = (filename) => {
  if (!filename) return null;
  const timestamp = new Date().getTime();
  return `${BASE_URL}/uploads/cover_photos/${encodeURIComponent(filename)}?t=${timestamp}`;
};

const watermarkUrl = (filename) => {
  if (!filename) return null;
  const timestamp = new Date().getTime();
  return `${BASE_URL}/uploads/watermarks/${encodeURIComponent(filename)}?t=${timestamp}`;
};

const Profile = () => {
  // Use custom hooks
  const {
    user,
    isLoading,
    locations,
    selectedLocation,
    commissions,
    watermark: profileWatermark,
    coverPhoto: profileCoverPhoto,
    setSelectedLocation,
    updateProfile,
    updateCommissions,
    refreshProfile,
    setWatermarkState,
    setCoverPhotoState
  } = useProfile();

  const {
    watermark,
    watermarkFile,
    previewUrl,
    isUploading,
    isDeleting,
    imageLoadError,
    setImageLoadError,
    handleWatermarkSelect,
    handleWatermarkUpload,
    handleCancelSelection,
    handleDeleteWatermark,
  } = useWatermark(refreshProfile, profileWatermark, setWatermarkState);

  const {
    coverPhoto,
    coverPhotoFile,
    coverPreviewUrl,
    isCoverUploading,
    coverImageLoadError,
    setCoverImageLoadError,
    handleCoverPhotoSelect,
    handleCoverPhotoUpload,
    handleCoverCancelSelection,
    handleRemoveCoverPhoto,
  } = useCoverPhoto(refreshProfile, profileCoverPhoto, setCoverPhotoState);

  // Local state only for UI interactions
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [isSocialMediaModalOpen, setIsSocialMediaModalOpen] = useState(false); // NEW STATE
  const [isSavingSocialMedia, setIsSavingSocialMedia] = useState(false); // NEW STATE
  const [activeTab, setActiveTab] = useState("posts");
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editPfp, setEditPfp] = useState(null);
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCoverDeleteConfirm, setShowCoverDeleteConfirm] = useState(false);
  const [gcashNumber, setGcashNumber] = useState("");
  const [isEditingGcash, setIsEditingGcash] = useState(false);
  const [isSavingGcash, setIsSavingGcash] = useState(false);
  const [gcashError, setGcashError] = useState("");

  // Fetch portfolio
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

  // Event handlers
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
    const success = await updateProfile({
      username: editUsername,
      bio: editBio,
      location_id: selectedLocation,
      pfp: editPfp
      // Social media links removed from here - handled separately
    });
    if (success) {
      setIsEditing(false);
    }
  };

  // NEW: Handler for saving social media links
  const handleSaveSocialMedia = async (socialMediaData) => {
  setIsSavingSocialMedia(true);
  const success = await updateProfile(socialMediaData);
  if (success) {
    setIsSocialMediaModalOpen(false);
    // ADD THIS: Refresh profile to update local state
    await refreshProfile();
  }
  setIsSavingSocialMedia(false);
};

  const handleSaveGcash = async () => {
    if (gcashNumber && !/^09\d{9}$/.test(gcashNumber)) {
      setGcashError("Invalid GCash number. Must be 11 digits starting with 09.");
      return;
    }

    setIsSavingGcash(true);
    const token = localStorage.getItem("token");
    
    try {
      await axios.patch(
        `${BASE_URL}/api/profile/gcash`,
        { gcash_number: gcashNumber || null },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      await refreshProfile();
      setIsEditingGcash(false);
      setGcashError("");
    } catch (error) {
      setGcashError(error.response?.data?.message || "Failed to update GCash.");
    } finally {
      setIsSavingGcash(false);
    }
  };

  const handlePfpChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditPfp(file);
    }
  };

  const toggleCommissions = async () => {
    const newStatus = commissions === "closed" ? "open" : "closed";
    await updateCommissions(newStatus);
  };

  // Global event listeners for image protection
  useEffect(() => {
    const preventDefault = (e) => {
      if (e.target.closest('.watermark-protected')) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('contextmenu', preventDefault);
    document.addEventListener('dragstart', preventDefault);
    
    return () => {
      document.removeEventListener('contextmenu', preventDefault);
      document.removeEventListener('dragstart', preventDefault);
    };
  }, []);

  // Fetch portfolio on component mount
  useEffect(() => {
    fetchPortfolio();
  }, []);

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
        className="ml-50 flex-grow px-6"
      >
        {/* Profile Header with Cover Photo */}
        <ProfileHeader
          coverPhoto={coverPhoto}
          coverPreviewUrl={coverPreviewUrl}
          coverPhotoUrl={coverPhotoUrl}
          onCoverImageError={() => setCoverImageLoadError(true)}
        >
          {/* 3-Column Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr_auto] gap-6 items-start">
            {/* Column 1: Profile Picture + Commissions */}
            <ProfilePictureSection
              user={user}
              isEditing={isEditing}
              editPfp={editPfp}
              onPfpChange={handlePfpChange}
            >
              <ActionButtons
                commissions={commissions}
                onToggleCommissions={toggleCommissions}
                onToggleUploadModal={toggleUploadModal}
                onToggleVerifyModal={toggleVerifyModal}
                user={user}
                isEditing={isEditing}
              />
            </ProfilePictureSection>

            {/* Column 2: Profile Details */}
            <ProfileInfo
              user={user}
              isEditing={isEditing}
              editUsername={editUsername}
              editBio={editBio}
              locations={locations}
              selectedLocation={selectedLocation}
              onEdit={startEditing}
              onUsernameChange={(e) => setEditUsername(e.target.value)}
              onBioChange={(e) => setEditBio(e.target.value)}
              onLocationChange={(e) => setSelectedLocation(e.target.value ? Number(e.target.value) : null)}
              CheckIcon={CheckIcon}
              onSaveChanges={handleProfileUpdate}
              onCancelEditing={cancelEditing}
              isLoading={isLoading}
              gcashNumber={gcashNumber}
              setGcashNumber={setGcashNumber}
              isEditingGcash={isEditingGcash}
              setIsEditingGcash={setIsEditingGcash}
              isSavingGcash={isSavingGcash}
              gcashError={gcashError}
              onSaveGcash={handleSaveGcash}
              onEditSocialMedia={() => setIsSocialMediaModalOpen(true)} // NEW PROP
            />

            {/* Column 3: Watermark + Cover Photo */}
            <WatermarkSection
              // Watermark state
              watermark={watermark}
              watermarkFile={watermarkFile}
              previewUrl={previewUrl}
              isUploading={isUploading}
              isDeleting={isDeleting}
              imageLoadError={imageLoadError}
              
              // Cover photo state
              coverPhoto={coverPhoto}
              coverPhotoFile={coverPhotoFile}
              coverPreviewUrl={coverPreviewUrl}
              isCoverUploading={isCoverUploading}
              
              // Handlers
              onWatermarkSelect={handleWatermarkSelect}
              onWatermarkUpload={handleWatermarkUpload}
              onCancelSelection={handleCancelSelection}
              onDeleteWatermark={handleDeleteWatermark}
              onCoverPhotoSelect={handleCoverPhotoSelect}
              onCoverPhotoUpload={handleCoverPhotoUpload}
              onCoverCancelSelection={handleCoverCancelSelection}
              onRemoveCoverPhoto={handleRemoveCoverPhoto}
              onShowDeleteConfirm={() => setShowDeleteConfirm(true)}
              onShowCoverDeleteConfirm={() => setShowCoverDeleteConfirm(true)}
              
              // URLs
              watermarkUrl={watermarkUrl}
            />
          </div>
        </ProfileHeader>

        {/* Cover Photo Upload Status */}
        {isCoverUploading && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700">
                Uploading cover photo...
              </span>
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <CloudArrowUpIcon className="w-4 h-4 animate-pulse" />
                Processing...
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal for Watermark */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm mx-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete Watermark?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to delete your watermark? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    await handleDeleteWatermark();
                    setShowDeleteConfirm(false);
                  }}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors flex items-center gap-2"
                >
                  <TrashIcon className="w-4 h-4" />
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal for Cover Photo */}
        {showCoverDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm mx-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Remove Cover Photo?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to remove your cover photo? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowCoverDeleteConfirm(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    await handleRemoveCoverPhoto();
                    setShowCoverDeleteConfirm(false);
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors flex items-center gap-2"
                >
                  <TrashIcon className="w-4 h-4" />
                  Remove Cover
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Social Media Modal - ADD THIS */}
        <SocialMediaModal
          isOpen={isSocialMediaModalOpen}
          onClose={() => setIsSocialMediaModalOpen(false)}
          user={user}
          onSave={handleSaveSocialMedia}
          isLoading={isSavingSocialMedia}
        />

        <div className="border-b border-gray-200 mb-4"></div>

        {/* Tabs Section */}
        <div className="flex border-b border-gray-300 mb-6 text-sm">
          {[
            { key: "posts", icon: NewspaperIcon, label: "Posts" },
            { key: "ownart", icon: PhotoIcon, label: "Art Posts" },
            { key: "portfolio", icon: Squares2X2Icon, label: "Gallery" },
            { key: "ownauct", icon: TagIcon, label: "Auctions" },
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