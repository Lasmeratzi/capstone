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
import MobileNav from "../../components/layout/MobileNav";

import { useProfile } from "../../hooks/useProfile";
import { useWatermark } from "../../hooks/useWatermark";
import { useCoverPhoto } from "../../hooks/useCoverPhoto";

import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileInfo from "../../components/profile/ProfileInfo";
import ProfilePictureSection from "../../components/profile/ProfilePictureSection";
import ActionButtons from "../../components/profile/ActionButtons";
import WatermarkSection from "../../components/profile/WatermarkSection";
import SocialMediaModal from "../../components/modals/socialmediamodal";
const BASE_URL = "http://localhost:5000";

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

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [isSocialMediaModalOpen, setIsSocialMediaModalOpen] = useState(false);
  const [isSavingSocialMedia, setIsSavingSocialMedia] = useState(false);
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
    });
    if (success) {
      setIsEditing(false);
    }
  };

  const handleSaveSocialMedia = async (socialMediaData) => {
    setIsSavingSocialMedia(true);
    const success = await updateProfile(socialMediaData);
    if (success) {
      setIsSocialMediaModalOpen(false);
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

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const [isWatermarkVisible, setIsWatermarkVisible] = useState(false);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex">
      <MobileNav />

      <div className="hidden md:block fixed h-screen w-50">
        <Sidebar />
      </div>

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="ml-0 md:ml-50 flex-grow px-4 md:px-6 pt-16 md:pt-0 pb-20 md:pb-0 overflow-x-hidden bg-white dark:bg-[#0A0A0B]"
      >
        <ProfileHeader
          coverPhoto={coverPhoto}
          coverPreviewUrl={coverPreviewUrl}
          coverPhotoUrl={coverPhotoUrl}
          onCoverImageError={() => setCoverImageLoadError(true)}
          isEditing={isEditing}
        >
          <div className="flex lg:hidden items-center gap-4 mb-6">
            <ProfilePictureSection
              user={user}
              isEditing={isEditing}
              editPfp={editPfp}
              onPfpChange={handlePfpChange}
            />
            <ProfileInfo
              user={user}
              isEditing={isEditing}
              onEdit={startEditing}
              CheckIcon={CheckIcon}
              variant="header"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr_auto] gap-6 items-start">
            <div className="hidden lg:block">
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
            </div>

            <div className="flex flex-col space-y-4">
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
                onEditSocialMedia={() => setIsSocialMediaModalOpen(true)}
              />

              <div className="flex lg:hidden flex-col">
                <ActionButtons
                  commissions={commissions}
                  onToggleCommissions={toggleCommissions}
                  onToggleUploadModal={toggleUploadModal}
                  onToggleVerifyModal={toggleVerifyModal}
                  user={user}
                  isEditing={isEditing}
                />
              </div>

              <button
                onClick={() => setIsWatermarkVisible(!isWatermarkVisible)}
                className="lg:hidden flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-lg backdrop-blur-md border border-white/20 transition-all mt-2"
              >
                <CameraIcon className="w-4 h-4" />
                {isWatermarkVisible ? "Hide Cover & Watermark Settings" : "Edit Cover & Watermark"}
              </button>
            </div>

            <div className={`${isWatermarkVisible ? 'block' : 'hidden'} lg:block`}>
              <WatermarkSection
                watermark={watermark}
                watermarkFile={watermarkFile}
                previewUrl={previewUrl}
                isUploading={isUploading}
                isDeleting={isDeleting}
                imageLoadError={imageLoadError}

                coverPhoto={coverPhoto}
                coverPhotoFile={coverPhotoFile}
                coverPreviewUrl={coverPreviewUrl}
                isCoverUploading={isCoverUploading}

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

                watermarkUrl={watermarkUrl}
              />
            </div>
          </div>
        </ProfileHeader>

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

        <SocialMediaModal
          isOpen={isSocialMediaModalOpen}
          onClose={() => setIsSocialMediaModalOpen(false)}
          user={user}
          onSave={handleSaveSocialMedia}
          isLoading={isSavingSocialMedia}
        />

        <div className="border-b border-gray-100 dark:border-white/5 mb-8"></div>

        <div className="flex border-b border-gray-100 dark:border-white/5 mb-8 text-sm overflow-x-auto no-scrollbar">
          {[
            { key: "posts", icon: NewspaperIcon, label: "Posts" },
            { key: "ownart", icon: PhotoIcon, label: "Art Posts" },
            { key: "portfolio", icon: Squares2X2Icon, label: "Gallery" },
            { key: "ownauct", icon: TagIcon, label: "Auctions" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 min-w-[120px] py-4 font-bold flex items-center justify-center gap-2 transition-all duration-300 relative cursor-pointer ${activeTab === tab.key
                  ? "text-[#5E66FF]"
                  : "text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"
                }`}
            >
              <tab.icon className={`h-5 w-5 transition-transform duration-300 ${activeTab === tab.key ? "scale-110" : "scale-100"}`} />
              <span className="tracking-tight">{tab.label}</span>

              {activeTab === tab.key && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#5E66FF]"
                  initial={false}
                />
              )}
            </button>
          ))}
        </div>

        {activeTab === "posts" && <OwnPost userId={user.id} />}
        {activeTab === "ownart" && <OwnArt userId={user.id} />}
        {activeTab === "portfolio" && (
          <PortfolioGrid portfolioItems={portfolioItems} loggedInUserId={user.id} />
        )}
        {activeTab === "ownauct" && <OwnAuct userId={user.id} />}

        {isUploadModalOpen && (
          <div className="fixed inset-0 bg-gray-950/90 backdrop-blur-md flex justify-center items-center z-50 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]">
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-lg w-full relative mx-4 my-8">
              <button onClick={toggleUploadModal} className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-2xl">&times;</button>
              <PortfolioUpload onSuccess={toggleUploadModal} />
            </div>
          </div>
        )}

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