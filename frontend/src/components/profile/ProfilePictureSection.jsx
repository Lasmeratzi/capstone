import React from 'react';

const BASE_URL = "http://localhost:5000";

const ProfilePictureSection = ({ 
  user, 
  isEditing, 
  editPfp, 
  onPfpChange,
  children 
}) => {
  return (
    <div className="w-32 flex flex-col items-center mx-auto sm:mx-0">
      <div className="relative group">
        <img
          src={
            editPfp
              ? URL.createObjectURL(editPfp)
              : `${BASE_URL}/uploads/${user.pfp}`
          }
          alt={`${user.username}'s Profile`}
          className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-white transition-all duration-300"
        />
        {isEditing && (
          <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer transition-opacity opacity-0 group-hover:opacity-100">
            <input
              type="file"
              accept="image/*"
              onChange={onPfpChange}
              className="hidden"
            />
            <span className="text-white text-sm font-medium">
              Change Photo
            </span>
          </label>
        )}
      </div>
      
      {/* Commissions button and other actions */}
      {children}
    </div>
  );
};

export default ProfilePictureSection;