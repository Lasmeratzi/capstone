import React from 'react';
import { CameraIcon } from "@heroicons/react/24/outline";

const ProfileHeader = ({ 
  coverPhoto, 
  coverPreviewUrl, 
  coverPhotoUrl, 
  onCoverImageError,
  children 
}) => {
  return (
    <div className="relative mb-6 -mx-6 bg-gray-200 h-80">
      {/* Cover Photo Background */}
      <div className="w-full h-full">
        {coverPhoto || coverPreviewUrl ? (
          <img
            src={coverPreviewUrl || coverPhotoUrl(coverPhoto)}
            alt="Cover"
            className="w-full h-full object-cover"
            onError={onCoverImageError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-gray-300 to-gray-400">
            <CameraIcon className="w-16 h-16 text-gray-500" />
          </div>
        )}
      </div>

      {/* Profile Content Overlay */}
      <div className="absolute inset-0 p-6 bg-gradient-to-t from-black/50 to-transparent h-full">
        {children}
      </div>
    </div>
  );
};

export default ProfileHeader;