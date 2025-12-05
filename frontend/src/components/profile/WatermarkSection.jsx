import React from 'react';
import { 
  TrashIcon, 
  CloudArrowUpIcon,
  CameraIcon
} from "@heroicons/react/24/outline";
import ProtectedWatermarkImage from './ProtectedWatermarkImage';

const WatermarkSection = ({
  // Watermark state
  watermark,
  watermarkFile,
  previewUrl,
  isUploading,
  isDeleting,
  imageLoadError,
  
  // Cover photo state
  coverPhoto,
  coverPhotoFile,
  coverPreviewUrl,
  isCoverUploading,
  
  // Handlers
  onWatermarkSelect,
  onWatermarkUpload,
  onCancelSelection,
  onDeleteWatermark,
  onCoverPhotoSelect,
  onCoverPhotoUpload,
  onCoverCancelSelection,
  onRemoveCoverPhoto,
  onShowDeleteConfirm,
  onShowCoverDeleteConfirm,
  
  // URLs
  watermarkUrl
}) => {
  return (
    <div className="w-40 flex flex-col items-center space-y-4">
      {/* Watermark Section */}
      <div className="w-full">
        <h3 className="text-xs font-semibold text-white uppercase mb-2">
          Watermark
        </h3>

        {previewUrl ? (
          <div className="flex flex-col items-center space-y-2">
            <ProtectedWatermarkImage
              src={previewUrl}
              alt="Watermark Preview (local)"
              className="w-20 h-20 object-contain border rounded-md shadow-sm bg-white"
              onError={() => setImageLoadError(true)}
            />
            <div className="flex gap-2">
              <button
                onClick={onWatermarkUpload}
                disabled={isUploading}
                className="flex items-center gap-1 text-xs text-green-500 hover:text-green-400"
              >
                <CloudArrowUpIcon className="w-4 h-4" />
                {isUploading ? "Uploading..." : "Upload"}
              </button>
              <button
                onClick={onCancelSelection}
                className="flex items-center gap-1 text-xs text-white hover:text-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : watermark ? (
          <div className="flex flex-col items-center space-y-2">
            <ProtectedWatermarkImage
              src={watermarkUrl(watermark)}
              alt="Watermark Preview"
              className={`w-20 h-20 object-contain border rounded-md shadow-sm bg-white ${
                imageLoadError ? "hidden" : ""
              }`}
              onError={() => setImageLoadError(true)}
            />
            {imageLoadError && (
              <div className="text-xs text-red-400">Preview unavailable</div>
            )}
            <div className="flex gap-2">
              <label className="cursor-pointer text-xs text-blue-500 hover:text-blue-400 flex items-center gap-1">
                <input
                  type="file"
                  accept="image/png"
                  className="hidden"
                  onChange={(e) => onWatermarkSelect(e.target.files[0])}
                />
                <CloudArrowUpIcon className="w-4 h-4" />
                Replace
              </label>

              <button
                onClick={onShowDeleteConfirm}
                disabled={isDeleting}
                className="flex items-center gap-1 text-xs text-red-500 hover:text-red-400"
              >
                <TrashIcon className="w-4 h-4" />
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <label className="cursor-pointer text-blue-500 hover:text-blue-400 text-xs">
              <input
                type="file"
                accept="image/png"
                className="hidden"
                onChange={(e) => onWatermarkSelect(e.target.files[0])}
              />
              {watermarkFile ? watermarkFile.name : "Choose PNG File"}
            </label>
            <button
              onClick={onWatermarkUpload}
              disabled={!watermarkFile || isUploading}
              className={`flex items-center gap-1 text-xs ${
                isUploading
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-green-500 hover:text-green-400"
              }`}
            >
              <CloudArrowUpIcon className="w-4 h-4" />
              {isUploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        )}
      </div>

      {/* Cover Photo Upload Section */}
      <div className="w-full pt-4 border-t border-white/20">
        <h3 className="text-xs font-semibold text-white uppercase mb-2">
          Cover Photo
        </h3>
        <div className="flex flex-col items-center space-y-2">
          <label className="cursor-pointer bg-white/20 hover:bg-white/30 text-white text-xs rounded-lg px-3 py-2 transition-all duration-200 flex items-center gap-2">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onCoverPhotoSelect(e.target.files[0])}
            />
            <CameraIcon className="w-4 h-4 text-white" />
            {coverPhotoFile ? coverPhotoFile.name : "Upload Cover"}
          </label>
          
          {/* Remove Cover Photo Button */}
          {coverPhoto && !coverPhotoFile && (
            <button
              onClick={onShowCoverDeleteConfirm}
              className="flex items-center gap-1 text-xs text-red-500 hover:text-red-400"
            >
              <TrashIcon className="w-4 h-4" />
              Remove Cover
            </button>
          )}
          
          {(coverPreviewUrl || coverPhotoFile) && (
            <div className="flex gap-2">
              <button
                onClick={onCoverPhotoUpload}
                disabled={isCoverUploading}
                className="flex items-center gap-1 text-xs text-green-500 hover:text-green-400"
              >
                <CloudArrowUpIcon className="w-4 h-4" />
                {isCoverUploading ? "Uploading..." : "Upload"}
              </button>
              <button
                onClick={onCoverCancelSelection}
                className="flex items-center gap-1 text-xs text-white hover:text-gray-200"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WatermarkSection;