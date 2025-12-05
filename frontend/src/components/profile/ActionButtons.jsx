import React from 'react';
import { 
  PlusCircleIcon, 
  ShieldCheckIcon
} from "@heroicons/react/24/outline";
import { FaPaintBrush, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const ActionButtons = ({
  // Commissions props
  commissions,
  onToggleCommissions,
  
  // Portfolio & Verify props
  onToggleUploadModal,
  onToggleVerifyModal,
  user,
  
  // Edit mode props - REMOVED since we moved them
  isEditing
}) => {
  return (
    <>
      {/* Commissions Button */}
      <div className="mt-3 flex flex-col items-center w-full">
        <div className="flex items-center text-white font-medium text-xs uppercase tracking-wider mb-1">
          <FaPaintBrush className="mr-1.5 text-white" size={12} />
          <span>Commissions</span>
        </div>
        <button
          onClick={onToggleCommissions}
          className={`px-3 py-1 rounded-full flex items-center gap-1 shadow-sm transition-all duration-200 text-xs w-full justify-center ${
            commissions === "open"
              ? "bg-green-500 hover:bg-green-600 text-white"
              : "bg-rose-500 hover:bg-rose-600 text-white"
          }`}
        >
          {commissions === "open" ? (
            <>
              <FaCheckCircle size={12} />
              <span className="font-medium">Open</span>
            </>
          ) : (
            <>
              <FaTimesCircle size={12} />
              <span className="font-medium">Closed</span>
            </>
          )}
        </button>
      </div>

      {/* Portfolio & Verify Buttons */}
      {!isEditing && (
        <div className="flex flex-col gap-2 mt-3 w-full">
          <button 
            onClick={onToggleUploadModal} 
            className="flex items-center justify-center gap-1 px-2 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md shadow transition-all duration-300 w-full"
          >
            <PlusCircleIcon className="h-3 w-3" />
            <span>Portfolio</span>
          </button>
          {!user.isVerified && (
            <button 
              onClick={onToggleVerifyModal} 
              className="flex items-center justify-center gap-1 px-2 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium rounded-md shadow transition-all duration-300 w-full"
            >
              <ShieldCheckIcon className="h-3 w-3" />
              <span>Verify Account</span>
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default ActionButtons;