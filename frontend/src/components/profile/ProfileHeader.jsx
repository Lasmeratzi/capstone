import React from 'react';
import { CameraIcon } from "@heroicons/react/24/outline";

const ProfileHeader = ({ 
  coverPhoto, 
  coverPreviewUrl, 
  coverPhotoUrl, 
  onCoverImageError,
  isEditing,
  children 
}) => {
  return (
    <div className={`relative mb-6 -mx-4 md:-mx-6 bg-gray-200 min-h-[320px] ${isEditing ? '' : 'lg:h-80 overflow-hidden'}`}>
      {/* Cover Photo Background */}
      <div className="absolute inset-0 w-full h-full z-0">
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
      <div className={`relative z-10 p-6 pt-20 md:pt-6 bg-gradient-to-t from-black/70 via-black/40 to-black/20 min-h-[320px] ${isEditing ? '' : 'lg:h-full'} flex flex-col justify-end text-white`}>
        {children}
      </div>
    </div>
  );
};

export default ProfileHeader;