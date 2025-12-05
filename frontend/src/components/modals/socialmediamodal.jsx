import React, { useState, useEffect } from 'react';
import { FaInstagram, FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6"; // FIXED: Changed from 'react-icons/fa'
import { XMarkIcon } from "@heroicons/react/24/outline";

const SocialMediaModal = ({ 
  isOpen, 
  onClose, 
  user,
  onSave,
  isLoading 
}) => {
  const [twitterLink, setTwitterLink] = useState("");
  const [instagramLink, setInstagramLink] = useState("");
  const [facebookLink, setFacebookLink] = useState("");

  // Initialize form with user data when modal opens
  useEffect(() => {
    if (isOpen && user) {
      setTwitterLink(user.twitter_link || "");
      setInstagramLink(user.instagram_link || "");
      setFacebookLink(user.facebook_link || "");
    }
  }, [isOpen, user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      twitter_link: twitterLink.trim() || null,
      instagram_link: instagramLink.trim() || null,
      facebook_link: facebookLink.trim() || null
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Edit Social Media Links</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Twitter/X Field */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <FaXTwitter className="text-gray-700" />
              Twitter/X
            </label>
            <input
              type="url"
              value={twitterLink}
              onChange={(e) => setTwitterLink(e.target.value)}
              placeholder="https://twitter.com/username"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Instagram Field */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <FaInstagram className="text-pink-600" />
              Instagram
            </label>
            <input
              type="url"
              value={instagramLink}
              onChange={(e) => setInstagramLink(e.target.value)}
              placeholder="https://instagram.com/username"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Facebook Field */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <FaFacebook className="text-blue-600" />
              Facebook
            </label>
            <input
              type="url"
              value={facebookLink}
              onChange={(e) => setFacebookLink(e.target.value)}
              placeholder="https://facebook.com/username"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-xs text-blue-700">
              <span className="font-medium">Note:</span> Social media links are only publicly visible after verification. You can still save them here for future verification.
            </p>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SocialMediaModal;