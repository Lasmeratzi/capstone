import React from 'react';
import { CameraIcon } from "@heroicons/react/24/outline";

const BASE_URL = "http://localhost:5000";

const ProfilePictureSection = ({ 
  user, 
  isEditing, 
  editPfp, 
  onPfpChange,
  children 
}) => {
  return (
    <div className="w-24 sm:w-32 flex flex-col items-center mx-auto sm:mx-0">
      <div className="relative group">
        <img
          src={
            editPfp
              ? URL.createObjectURL(editPfp)
              : `${BASE_URL}/uploads/${user.pfp}`
          }
          alt={`${user.username}'s Profile`}
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover shadow-lg border-4 border-white transition-all duration-300"
        />
        {isEditing && (
          <label className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/60 rounded-full cursor-pointer transition-all duration-300">
            <input
              type="file"
              accept="image/*"
              onChange={onPfpChange}
              className="hidden"
            />
            <div className="flex flex-col items-center gap-1">
              <CameraIcon className="w-5 h-5 text-white" />
              <span className="text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                Change
              </span>
            </div>
          </label>
        )}
      </div>
      
      {/* Commissions button and other actions */}
      {children}
    </div>
  );
};

export default ProfilePictureSection;