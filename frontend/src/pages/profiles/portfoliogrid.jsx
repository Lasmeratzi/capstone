// src/pages/profiles/PortfolioGrid.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  PencilSquareIcon, 
  TrashIcon, 
  ChatBubbleLeftRightIcon,
  CheckIcon,
  XMarkIcon,
  UserCircleIcon
} from "@heroicons/react/20/solid";

const PortfolioGrid = ({ portfolioItems, loggedInUserId }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [authorInfo, setAuthorInfo] = useState(null);

  // Auto-reply states
  const [autoReplyText, setAutoReplyText] = useState("");
  const [hasAutoReply, setHasAutoReply] = useState(false);
  const [isEditingAutoReply, setIsEditingAutoReply] = useState(false);
  const [autoReplyLoading, setAutoReplyLoading] = useState(false);

  const navigate = useNavigate();

  const fetchAuthorInfo = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:5000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAuthorInfo(response.data);
    } catch (error) {
      console.error("Failed to fetch author info:", error);
    }
  };

  const handleImageClick = async (item) => {
    setSelectedItem(item);
    setTitle(item.title);
    setDescription(item.description);
    setImage(null);
    setIsEditingAutoReply(false);

    // Fetch author information
    await fetchAuthorInfo(item.user_id);

    // 🔹 Fetch auto-reply for this portfolio item WITH AUTHENTICATION
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5000/api/auto-replies/${item.id}`,
        {
          headers: { 
            Authorization: `Bearer ${token}` 
          }
        }
      );
      
      if (res.data && res.data.reply_text) {
        setAutoReplyText(res.data.reply_text);
        setHasAutoReply(true);
      } else {
        setAutoReplyText("");
        setHasAutoReply(false);
      }
    } catch (error) {
      console.error("Failed to fetch auto-reply:", error);
      setAutoReplyText("");
      setHasAutoReply(false);
    }
  };

  const closeModal = () => {
    setSelectedItem(null);
    setIsEditing(false);
    setIsEditingAutoReply(false);
    setTitle("");
    setDescription("");
    setImage(null);
    setAutoReplyText("");
    setHasAutoReply(false);
    setAuthorInfo(null);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this portfolio item? This action cannot be undone."
    );
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    try {
      await axios.delete(`http://localhost:5000/api/portfolio/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(`Deleted item with id: ${id}`);
      closeModal();
      navigate(0);
    } catch (error) {
      console.error("Failed to delete portfolio item:", error);
    }
  };

  const handleEditSubmit = async () => {
    const token = localStorage.getItem("token");
    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    if (image) {
      formData.append("image", image);
    }

    try {
      await axios.patch(
        `http://localhost:5000/api/portfolio/${selectedItem.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(`Edited item:`, selectedItem);
      closeModal();
      navigate(0);
    } catch (error) {
      console.error("Failed to edit portfolio item:", error);
    }
  };

  // 🔹 Auto-reply handlers
  const handleSaveAutoReply = async () => {
    if (!autoReplyText.trim()) {
      alert("Please enter an auto-reply message.");
      return;
    }

    setAutoReplyLoading(true);
    const token = localStorage.getItem("token");

    try {
      if (hasAutoReply) {
        // Update existing auto-reply
        await axios.put(
          `http://localhost:5000/api/auto-replies/${selectedItem.id}`,
          { reply_text: autoReplyText },
          { 
            headers: { 
              Authorization: `Bearer ${token}` 
            } 
          }
        );
      } else {
        // Create new auto-reply
        await axios.post(
          "http://localhost:5000/api/auto-replies",
          { portfolioItemId: selectedItem.id, reply_text: autoReplyText },
          { 
            headers: { 
              Authorization: `Bearer ${token}` 
            } 
          }
        );
        setHasAutoReply(true);
      }
      
      setIsEditingAutoReply(false);
    } catch (error) {
      console.error(
        "Failed to save auto-reply:",
        error.response?.data || error.message
      );
      alert("Failed to save auto-reply. Please try again.");
    } finally {
      setAutoReplyLoading(false);
    }
  };

  const handleDeleteAutoReply = async () => {
    if (!confirm("Are you sure you want to delete this auto-reply?")) return;

    const token = localStorage.getItem("token");
    try {
      await axios.delete(
        `http://localhost:5000/api/auto-replies/${selectedItem.id}`,
        {
          headers: { 
            Authorization: `Bearer ${token}` 
          },
        }
      );
      setAutoReplyText("");
      setHasAutoReply(false);
      setIsEditingAutoReply(false);
    } catch (error) {
      console.error(
        "Failed to delete auto-reply:",
        error.response?.data || error.message
      );
    }
  };

  const startEditingAutoReply = () => {
    setIsEditingAutoReply(true);
  };

  const cancelEditingAutoReply = () => {
    setIsEditingAutoReply(false);
    // Reset to original auto-reply text
    if (selectedItem) {
      handleImageClick(selectedItem); // Refetch the current state
    }
  };

  const isOwner = selectedItem && Number(selectedItem.user_id) === Number(loggedInUserId);

  return (
    <div className="relative">
      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolioItems.length === 0 ? (
          <p className="text-gray-500 col-span-full text-center py-8">
            No portfolio items to display.
          </p>
        ) : (
          portfolioItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleImageClick(item)}
              className="group relative cursor-pointer transform transition-all duration-300 hover:scale-105 w-full h-0 pb-[100%] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl border border-gray-200"
              style={{ position: "relative" }}
            >
              <img
                src={`http://localhost:5000/uploads/${item.image_path}`}
                alt={item.title}
                className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Subtle overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-start p-4">
                <h3 className="text-white text-lg font-semibold drop-shadow-lg">
                  {item.title}
                </h3>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedItem && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3, type: "spring", damping: 25 }}
            className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden flex flex-col lg:flex-row relative border border-gray-100"
          >
            {/* Image Section - Larger */}
            <div className="lg:w-3/5 flex items-center justify-center p-10 bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="relative w-full h-full max-h-[85vh] flex items-center justify-center">
                <img
                  src={`http://localhost:5000/uploads/${selectedItem.image_path}`}
                  alt={selectedItem.title}
                  className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                />
              </div>
            </div>

            {/* Content Section */}
            <div className="lg:w-2/5 flex flex-col p-8 overflow-y-auto">
              {/* Header with Close Button and Portfolio Management */}
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
                {/* Author Information */}
                {authorInfo && (
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {authorInfo.pfp ? (
                        <img
                          src={`http://localhost:5000/uploads/${authorInfo.pfp}`}
                          alt={authorInfo.fullname}
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 shadow-sm"
                        />
                      ) : (
                        <UserCircleIcon className="w-12 h-12 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {authorInfo.fullname}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        @{authorInfo.username}
                      </p>
                    </div>
                  </div>
                )}

                {/* Portfolio Management Buttons */}
                {isOwner && !isEditing && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center px-3 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium text-sm border border-gray-300 shadow-sm hover:border-gray-400"
                    >
                      <PencilSquareIcon className="h-4 w-4 mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(selectedItem.id)}
                      className="flex items-center px-3 py-2 bg-white text-red-600 rounded-lg hover:bg-red-50 transition-all duration-200 font-medium text-sm border border-gray-300 shadow-sm hover:border-red-300"
                    >
                      <TrashIcon className="h-4 w-4 mr-2" />
                      Delete
                    </button>
                    <button
                      onClick={closeModal}
                      className="flex items-center p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 border border-transparent hover:border-gray-300"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                )}

                {/* Close Button Only (when no management buttons) */}
                {(!isOwner || isEditing) && (
                  <button
                    onClick={closeModal}
                    className="flex items-center p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 border border-transparent hover:border-gray-300"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter portfolio item title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all duration-200"
                      rows="4"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your portfolio item"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Update Image
                    </label>
                    <div className="flex items-center space-x-4 p-4 border border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors duration-200">
                      <div className="text-center">
                        <input
                          type="file"
                          className="w-full text-sm text-gray-500"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={handleEditSubmit}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 font-medium text-sm border border-green-700 shadow-sm"
                    >
                      <CheckIcon className="h-4 w-4 mr-2" />
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium text-sm border border-gray-300 shadow-sm"
                    >
                      <XMarkIcon className="h-4 w-4 mr-2" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Portfolio Content */}
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                      {selectedItem.title}
                    </h1>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-600 leading-relaxed text-lg">
                        {selectedItem.description}
                      </p>
                    </div>
                  </div>

                  {/* Owner-only actions */}
                  {isOwner && (
                    <div className="mt-8 pt-8 border-t border-gray-200">
                      {/* Auto-reply Section */}
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <ChatBubbleLeftRightIcon className="h-4 w-4 text-gray-600" />
                            <h3 className="text-sm font-semibold text-gray-800">
                              Auto Reply
                            </h3>
                          </div>
                          {hasAutoReply && !isEditingAutoReply && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                              Active
                            </span>
                          )}
                        </div>

                        {isEditingAutoReply ? (
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Auto Reply Message
                              </label>
                              <textarea
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all duration-200 bg-white text-sm"
                                rows="3"
                                placeholder="Enter your automated response message..."
                                value={autoReplyText}
                                onChange={(e) => setAutoReplyText(e.target.value)}
                                disabled={autoReplyLoading}
                              />
                            </div>
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={handleSaveAutoReply}
                                disabled={autoReplyLoading}
                                className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm border border-green-700 shadow-sm"
                              >
                                <CheckIcon className="h-4 w-4 mr-2" />
                                {autoReplyLoading ? "Saving..." : "Save"}
                              </button>
                              <button
                                onClick={cancelEditingAutoReply}
                                disabled={autoReplyLoading}
                                className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 font-medium text-sm border border-gray-300 shadow-sm"
                              >
                                <XMarkIcon className="h-4 w-4 mr-2" />
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            {hasAutoReply ? (
                              <>
                                {/* Auto-reply message with shorter width */}
                                <div className="flex-1 bg-white rounded-lg border border-gray-300 p-3 mr-4">
                                  <p className="text-gray-700 text-sm leading-relaxed">
                                    {autoReplyText}
                                  </p>
                                </div>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={startEditingAutoReply}
                                    className="flex items-center px-3 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium text-sm border border-gray-300 shadow-sm hover:border-gray-400"
                                  >
                                    <PencilSquareIcon className="h-4 w-4 mr-2" />
                                    Edit
                                  </button>
                                  <button
                                    onClick={handleDeleteAutoReply}
                                    className="flex items-center px-3 py-2 bg-white text-red-600 rounded-lg hover:bg-red-50 transition-all duration-200 font-medium text-sm border border-gray-300 shadow-sm hover:border-red-300"
                                  >
                                    <TrashIcon className="h-4 w-4 mr-2" />
                                    Delete
                                  </button>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex-1">
                                  <p className="text-gray-500 text-sm">
                                    Set an automatic reply for inquiries about this item
                                  </p>
                                </div>
                                <button
                                  onClick={startEditingAutoReply}
                                  className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium text-sm border border-blue-700 shadow-sm"
                                >
                                  <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                                  Add Auto Reply
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default PortfolioGrid;