import React from 'react';
import { 
  CakeIcon, 
  PencilSquareIcon, 
  MapPinIcon,
  ChevronDownIcon,
  CheckIcon,
  XMarkIcon,
  PencilIcon
} from "@heroicons/react/24/outline";
import { FaInstagram, FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import FollowStats from "../../pages/follow/followstats";

const VerifiedBadge = ({ CheckIcon }) => (
  <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500">
    <CheckIcon className="w-3 h-3 text-current dark:text-current" />
  </div>
);

const ProfileInfo = ({ 
  user, 
  isEditing, 
  editUsername, 
  editBio, 
  locations,
  selectedLocation,
  onEdit,
  onUsernameChange,
  onBioChange,
  onLocationChange,
  CheckIcon,
  onSaveChanges,
  onCancelEditing,
  isLoading,
  gcashNumber,
  setGcashNumber,
  isEditingGcash,
  setIsEditingGcash,
  isSavingGcash,
  gcashError,
  onSaveGcash,
  onEditSocialMedia,
  followButton,
  refreshTrigger,
  variant = "default", // Add variant prop: "default" or "header"
  className = ""
}) => {
  if (variant === "header") {
    return (
      <div className="flex flex-col text-white">
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-3xl font-bold text-white truncate max-w-[150px] sm:max-w-none">
            {user.username}
          </h2>
          {user.isVerified && (
            <span title="Verified" className="text-blue-300">
              <VerifiedBadge CheckIcon={CheckIcon} />
            </span>
          )}
          {!isEditing && onEdit && (
            <button
              onClick={onEdit}
              className="flex items-center gap-1 px-2 py-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-all text-[10px] font-medium backdrop-blur-sm ml-2"
              title="Edit Profile"
            >
              <PencilSquareIcon className="w-3 h-3" />
              <span>Edit</span>
            </button>
          )}
        </div>
        <div className="text-sm sm:text-xl text-white opacity-90 truncate">{user.fullname}</div>
        <div className="mt-1 flex items-center gap-3">
          {followButton}
          <FollowStats targetUserId={user.id} refreshTrigger={refreshTrigger} />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col space-y-1 sm:space-y-2 ${className || "text-current dark:text-current"}`}>
      <div className="flex items-center flex-wrap gap-2">
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <input
                type="text"
                value={editUsername}
                onChange={onUsernameChange}
                className="text-2xl sm:text-3xl font-bold text-white bg-black/40 border border-white/50 rounded-lg focus:border-white focus:ring-2 focus:ring-white/20 focus:outline-none px-3 py-1 max-w-xs transition-all placeholder-white/50 shadow-inner"
                placeholder="Username"
              />
              {/* Edit Buttons - RIGHT AFTER USERNAME TEXTBOX */}
              <div className="flex gap-2 ml-2">
                <button
                  onClick={onSaveChanges}
                  disabled={isLoading}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-current dark:text-current text-xs font-medium rounded-md shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-3 w-3 text-current dark:text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </>
                  ) : (
                    <CheckIcon className="h-3 w-3" />
                  )}
                </button>
                <button
                  onClick={onCancelEditing}
                  className="flex items-center gap-1 px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-medium rounded-md shadow transition-all"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="hidden lg:block text-xl sm:text-3xl font-bold text-current dark:text-current">
                {user.username}
              </h2>
              {user.isVerified && (
                <span title="Verified" className="text-blue-300">
                  <VerifiedBadge CheckIcon={CheckIcon} />
                </span>
              )}
            </>
          )}
        </div>
        {!isEditing && (
          <div className="hidden lg:flex items-center gap-2">
            {onEdit && (
              <button
                onClick={onEdit}
                className="flex items-center gap-1 px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-all text-xs font-medium backdrop-blur-sm"
                title="Edit Profile"
              >
                <PencilSquareIcon className="w-4 h-4" />
                <span>Edit</span>
              </button>
            )}
            {followButton}
            <FollowStats targetUserId={user.id} refreshTrigger={refreshTrigger} />
          </div>
        )}
      </div>

      <div className="hidden lg:block text-lg sm:text-xl text-current dark:text-current">{user.fullname}</div>

      <div className="flex items-center text-xs sm:text-sm text-current dark:text-current">
        <CakeIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-current dark:text-current" />
        {user.birthdate ? new Date(user.birthdate).toLocaleDateString() : "Not set"}
      </div>

      {isEditing ? (
        <textarea
          value={editBio}
          onChange={onBioChange}
          className="text-xs sm:text-sm text-white bg-black/40 border border-white/50 rounded-lg focus:border-white focus:ring-2 focus:ring-white/20 focus:outline-none px-3 py-2 resize-none transition-all placeholder-white/50 w-full max-w-xl shadow-inner"
          placeholder="Tell us about yourself..."
          rows="3"
        />
      ) : (
        <p className="text-xs sm:text-sm text-current dark:text-current italic max-w-xl overflow-hidden text-ellipsis line-clamp-2">
          {user.bio ? `"${user.bio}"` : "No bio provided."}
        </p>
      )}
      
      {/* Location Field */}
      {isEditing ? (
        <div className="mt-2">
          <label className="block text-sm font-medium text-current dark:text-current mb-2">
            <MapPinIcon className="w-4 h-4 inline mr-1 text-current dark:text-current" />
            Location
          </label>
          <div className="relative">
            <select
              value={selectedLocation?.toString() || ""}
              onChange={onLocationChange}
              className="w-full max-w-xs text-sm border border-white/50 rounded-lg px-3 py-2.5 focus:border-white focus:ring-2 focus:ring-white/20 focus:outline-none transition-all duration-200 appearance-none bg-black/40 text-white cursor-pointer shadow-inner"
            >
              <option value="" className="bg-gray-800 text-white">Select your location...</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id} className="bg-gray-800 text-white">
                  {loc.name}, {loc.province}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
              <ChevronDownIcon className="h-4 w-4" />
            </div>
          </div>
        </div>
      ) : (
        user.location_id && (
          <p className="text-sm text-current dark:text-current flex items-center gap-1">
            <MapPinIcon className="w-4 h-4 text-current dark:text-current" />
            <span>
              {(() => {
                if (!locations || !Array.isArray(locations)) return "Location not set";
                const loc = locations.find(l => l.id === Number(user.location_id));
                return loc ? (
                  <span className="font-medium text-current dark:text-current">
                    {loc.name}, <span className="text-current dark:text-current">{loc.province}</span>
                  </span>
                ) : "Location not found";
              })()}
            </span>
          </p>
        )
      )}

      <div className="text-xs mt-1">
        {user.verification_request_status === "pending" && (
          <p className="text-yellow-300">Your verification is under review.</p>
        )}
        {user.verification_request_status === "rejected" && (
          <p className="text-red-300">Your verification request was rejected.</p>
        )}
      </div>

      {/* Social Media Section - UPDATED */}
      {/* VIEW MODE: Show icons if user is verified AND has links */}
      {user.isVerified && (user.twitter_link || user.instagram_link || user.facebook_link) && (
        <div className="mt-1">
          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              {user.twitter_link && (
                <a 
                  href={user.twitter_link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-current dark:text-current hover:text-gray-200 transition-colors"
                  title="Twitter/X"
                >
                  <FaXTwitter size={20} />
                </a>
              )}
              {user.instagram_link && (
                <a 
                  href={user.instagram_link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-current dark:text-current hover:text-pink-200 transition-colors"
                  title="Instagram"
                >
                  <FaInstagram size={20} />
                </a>
              )}
              {user.facebook_link && (
                <a 
                  href={user.facebook_link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-current dark:text-current hover:text-blue-200 transition-colors"
                  title="Facebook"
                >
                  <FaFacebook size={20} />
                </a>
              )}
            </div>
            {/* Edit Social Media Button */}
            {onEditSocialMedia && (
              <button
                onClick={onEditSocialMedia}
                className="flex items-center gap-1 text-xs text-blue-300 hover:text-blue-200 transition-colors"
                title="Edit Social Media Links"
              >
                <PencilIcon className="w-3 h-3" />
                Edit
              </button>
            )}
          </div>
        </div>
      )}

      {/* Show "Add Social Media" button for verified users without links */}
      {user.isVerified && !user.twitter_link && !user.instagram_link && !user.facebook_link && onEditSocialMedia && (
        <div className="mt-1">
          <button
            onClick={onEditSocialMedia}
            className="flex items-center gap-1 text-xs text-blue-300 hover:text-blue-200 transition-colors"
            title="Add Social Media Links"
          >
            <PencilIcon className="w-3 h-3" />
            Add Social Media Links
          </button>
        </div>
      )}

      {/* GCash Section */}
      {user.isVerified && (
        <div className="mt-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-current dark:text-current">GCash:</span>
            
            {isEditingGcash ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={gcashNumber}
                  onChange={(e) => {
                    // Only allow numbers, max 11 digits
                    const value = e.target.value.replace(/\D/g, '').slice(0, 11);
                    setGcashNumber(value);
                  }}
                  placeholder="09123456789"
                  className="text-sm text-current dark:text-current bg-transparent border-b border-white/50 focus:border-white focus:outline-none px-1 py-0.5 w-32"
                  maxLength="11"
                />
                <div className="flex gap-1">
                  <button
                    onClick={onSaveGcash}
                    disabled={isSavingGcash}
                    className="flex items-center gap-1 px-2 py-0.5 bg-green-600 hover:bg-green-700 text-current dark:text-current text-xs rounded transition-all disabled:opacity-50"
                  >
                    {isSavingGcash ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingGcash(false);
                      // Reset to current user's GCash when canceling
                      setGcashNumber(user?.gcash_number || "");
                    }}
                    className="flex items-center gap-1 px-2 py-0.5 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs rounded transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm text-current dark:text-current">
                  {user?.gcash_number || user?.gcash || "Not set"}
                </span>
                {setIsEditingGcash && (
                  <button
                    onClick={() => {
                      setIsEditingGcash(true);
                      // Use the actual value from user object
                      setGcashNumber(user?.gcash_number || user?.gcash || "");
                    }}
                    className="text-xs text-blue-300 hover:text-blue-200 transition-colors"
                    title="Edit GCash number"
                  >
                    {(user?.gcash_number || user?.gcash) ? "Edit" : "Add"}
                  </button>
                )}
              </div>
            )}
          </div>
          {gcashError && (
            <p className="text-xs text-red-300 mt-1">{gcashError}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileInfo;