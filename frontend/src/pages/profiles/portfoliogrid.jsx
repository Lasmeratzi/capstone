// src/pages/profiles/PortfolioGrid.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  PencilSquareIcon, 
  TrashIcon, 
  ChatBubbleLeftRightIcon,
  CheckIcon,
  XMarkIcon,
  UserCircleIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  PhoneIcon
} from "@heroicons/react/20/solid";

// Custom debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const PortfolioGrid = ({ portfolioItems, loggedInUserId }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [authorInfo, setAuthorInfo] = useState(null);

  // Auto-reply states for 3 types
  const [priceReply, setPriceReply] = useState("");
  const [availabilityReply, setAvailabilityReply] = useState("");
  const [contactReply, setContactReply] = useState("");
  
  const [hasPriceReply, setHasPriceReply] = useState(false);
  const [hasAvailabilityReply, setHasAvailabilityReply] = useState(false);
  const [hasContactReply, setHasContactReply] = useState(false);
  
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [isEditingAvailability, setIsEditingAvailability] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);
  
  const [priceLoading, setPriceLoading] = useState(false);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);

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
    
    // Reset all editing states
    setIsEditingPrice(false);
    setIsEditingAvailability(false);
    setIsEditingContact(false);

    // Fetch author information
    await fetchAuthorInfo(item.user_id);

    // 🔹 Fetch ALL auto-replies for this portfolio item
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5000/api/auto-replies/item/${item.id}/all`,
        {
          headers: { 
            Authorization: `Bearer ${token}` 
          }
        }
      );
      
      // Initialize all reply types
      let priceText = "";
      let availabilityText = "";
      let contactText = "";
      let hasPrice = false;
      let hasAvailability = false;
      let hasContact = false;
      
      // Process the fetched auto-replies
      if (res.data && Array.isArray(res.data)) {
        res.data.forEach(reply => {
          switch(reply.inquiry_type) {
            case 'price':
              priceText = reply.reply_text;
              hasPrice = true;
              break;
            case 'availability':
              availabilityText = reply.reply_text;
              hasAvailability = true;
              break;
            case 'contact':
              contactText = reply.reply_text;
              hasContact = true;
              break;
          }
        });
      }
      
      setPriceReply(priceText);
      setAvailabilityReply(availabilityText);
      setContactReply(contactText);
      setHasPriceReply(hasPrice);
      setHasAvailabilityReply(hasAvailability);
      setHasContactReply(hasContact);
      
    } catch (error) {
      console.error("Failed to fetch auto-replies:", error);
      // Reset all states on error
      setPriceReply("");
      setAvailabilityReply("");
      setContactReply("");
      setHasPriceReply(false);
      setHasAvailabilityReply(false);
      setHasContactReply(false);
    }
  };

  const closeModal = () => {
    setSelectedItem(null);
    setIsEditing(false);
    setIsEditingPrice(false);
    setIsEditingAvailability(false);
    setIsEditingContact(false);
    setTitle("");
    setDescription("");
    setImage(null);
    setPriceReply("");
    setAvailabilityReply("");
    setContactReply("");
    setHasPriceReply(false);
    setHasAvailabilityReply(false);
    setHasContactReply(false);
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

  // 🔹 FIXED Auto-reply handler with better error handling
  const handleSaveAutoReply = async (type, text) => {
    if (!text.trim()) {
      alert(`Please enter a ${type} auto-reply message.`);
      return;
    }

    // Set loading state based on type
    if (type === 'price') setPriceLoading(true);
    else if (type === 'availability') setAvailabilityLoading(true);
    else if (type === 'contact') setContactLoading(true);

    const token = localStorage.getItem("token");

    try {
      // Use batch update endpoint - it handles both create and update
      const autoReplies = {
        price: type === 'price' ? text : priceReply,
        availability: type === 'availability' ? text : availabilityReply,
        contact: type === 'contact' ? text : contactReply
      };

      await axios.put(
        `http://localhost:5000/api/auto-replies/item/${selectedItem.id}/batch`,
        { autoReplies },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local states
      if (type === 'price') {
        setHasPriceReply(true);
        setIsEditingPrice(false);
      } else if (type === 'availability') {
        setHasAvailabilityReply(true);
        setIsEditingAvailability(false);
      } else if (type === 'contact') {
        setHasContactReply(true);
        setIsEditingContact(false);
      }
      
      // Refresh data
      await handleImageClick(selectedItem);
      
    } catch (error) {
      console.error(`Failed to save ${type} auto-reply:`, error);
      alert(`Failed to save ${type} auto-reply: ${error.response?.data?.message || error.message}`);
    } finally {
      // Reset loading state
      if (type === 'price') setPriceLoading(false);
      else if (type === 'availability') setAvailabilityLoading(false);
      else if (type === 'contact') setContactLoading(false);
    }
  };

  const handleDeleteAutoReply = async (type) => {
    if (!confirm(`Are you sure you want to delete the ${type} auto-reply?`)) return;

    const token = localStorage.getItem("token");
    try {
      await axios.delete(
        `http://localhost:5000/api/auto-replies/${selectedItem.id}`,
        {
          headers: { 
            Authorization: `Bearer ${token}` 
          },
          data: { inquiry_type: type }
        }
      );
      
      // Update local state
      if (type === 'price') {
        setPriceReply("");
        setHasPriceReply(false);
      } else if (type === 'availability') {
        setAvailabilityReply("");
        setHasAvailabilityReply(false);
      } else if (type === 'contact') {
        setContactReply("");
        setHasContactReply(false);
      }
      
      alert(`${type} auto-reply deleted successfully!`);
    } catch (error) {
      console.error(`Failed to delete ${type} auto-reply:`, error);
      alert(`Failed to delete ${type} auto-reply.`);
    }
  };

  // 🔹 Batch update all auto-replies at once
  const handleBatchUpdate = async () => {
    const token = localStorage.getItem("token");
    const autoReplies = {
      price: priceReply.trim(),
      availability: availabilityReply.trim(),
      contact: contactReply.trim()
    };

    try {
      await axios.put(
        `http://localhost:5000/api/auto-replies/item/${selectedItem.id}/batch`,
        { autoReplies },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local states
      setHasPriceReply(!!autoReplies.price);
      setHasAvailabilityReply(!!autoReplies.availability);
      setHasContactReply(!!autoReplies.contact);
      
      setIsEditingPrice(false);
      setIsEditingAvailability(false);
      setIsEditingContact(false);
      
      alert("All auto-replies updated successfully!");
    } catch (error) {
      console.error("Failed to batch update auto-replies:", error);
      alert("Failed to update auto-replies. Please try again.");
    }
  };

  const isOwner = selectedItem && Number(selectedItem.user_id) === Number(loggedInUserId);

  // Auto-reply section component for each type - FIXED FLICKERING
  const AutoReplySection = ({ 
    type, 
    icon: Icon, 
    title, 
    color, 
    replyText, 
    setReplyText,
    hasReply,
    isEditing,
    setIsEditing,
    loading,
    placeholder
  }) => {
    const textareaRef = useRef(null);
    const [localText, setLocalText] = useState(replyText);
    
    // Debounce the text to prevent too many re-renders
    const debouncedText = useDebounce(localText, 300);
    
    // Update parent state only after debounce
    useEffect(() => {
      if (debouncedText !== replyText) {
        setReplyText(debouncedText);
      }
    }, [debouncedText, replyText, setReplyText]);

    // Focus the textarea when editing starts
    useEffect(() => {
      if (isEditing && textareaRef.current) {
        textareaRef.current.focus();
        setLocalText(replyText); // Initialize with current value
        // Move cursor to end
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = textareaRef.current.value.length;
            textareaRef.current.selectionEnd = textareaRef.current.value.length;
          }
        }, 10);
      }
    }, [isEditing, replyText]);

    const handleCancel = () => {
      setIsEditing(false);
      setLocalText(replyText); // Reset to original text
    };

    return (
      <div className={`bg-${color}-50 rounded-lg p-4 border border-${color}-200`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Icon className={`h-4 w-4 text-${color}-600`} />
            <h3 className="text-sm font-semibold text-gray-800">
              {title} Auto-Reply
            </h3>
          </div>
          {hasReply && !isEditing && (
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-${color}-100 text-${color}-800 border border-${color}-200`}>
              Active
            </span>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-3">
            <div>
              <textarea
                ref={textareaRef}
                key={`textarea-${type}-${isEditing}`}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all duration-200 bg-white text-sm"
                rows="2"
                placeholder={placeholder}
                value={localText}
                onChange={(e) => setLocalText(e.target.value)}
                disabled={loading}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    handleCancel();
                  }
                }}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => handleSaveAutoReply(type, localText)}
                disabled={loading}
                className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm border border-green-700 shadow-sm"
              >
                <CheckIcon className="h-4 w-4 mr-2" />
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                onClick={handleCancel}
                disabled={loading}
                className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 font-medium text-sm border border-gray-300 shadow-sm"
              >
                <XMarkIcon className="h-4 w-4 mr-2" />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            {hasReply ? (
              <>
                <div className="flex-1 bg-white rounded-lg border border-gray-300 p-3 mr-4">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {replyText}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center px-3 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium text-sm border border-gray-300 shadow-sm hover:border-gray-400"
                  >
                    <PencilSquareIcon className="h-4 w-4 mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteAutoReply(type)}
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
                    Set an automatic reply for {title.toLowerCase()} inquiries
                  </p>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className={`flex items-center px-3 py-2 bg-${color}-600 text-white rounded-lg hover:bg-${color}-700 transition-all duration-200 font-medium text-sm border border-${color}-700 shadow-sm`}
                >
                  <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                  Add {title}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    );
  };

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

                  {/* Owner-only actions - 3 Auto-reply Sections */}
                  {isOwner && (
                    <div className="mt-8 pt-8 border-t border-gray-200 space-y-4">
                      <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                        <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2 text-gray-600" />
                        Auto-Reply Settings
                      </h3>
                      
                      {/* Price Auto-Reply */}
                      <AutoReplySection
                        type="price"
                        icon={CurrencyDollarIcon}
                        title="Price"
                        color="blue"
                        replyText={priceReply}
                        setReplyText={setPriceReply}
                        hasReply={hasPriceReply}
                        isEditing={isEditingPrice}
                        setIsEditing={setIsEditingPrice}
                        loading={priceLoading}
                        placeholder="e.g., My rate for this work starts at $XXX. Would you like a custom quote?"
                      />
                      
                      {/* Availability Auto-Reply */}
                      <AutoReplySection
                        type="availability"
                        icon={CheckCircleIcon}
                        title="Availability"
                        color="green"
                        replyText={availabilityReply}
                        setReplyText={setAvailabilityReply}
                        hasReply={hasAvailabilityReply}
                        isEditing={isEditingAvailability}
                        setIsEditing={setIsEditingAvailability}
                        loading={availabilityLoading}
                        placeholder="e.g., Yes, I'm currently available! My lead time is X days/weeks."
                      />
                      
                      {/* Contact Auto-Reply */}
                      <AutoReplySection
                        type="contact"
                        icon={PhoneIcon}
                        title="Contact"
                        color="purple"
                        replyText={contactReply}
                        setReplyText={setContactReply}
                        hasReply={hasContactReply}
                        isEditing={isEditingContact}
                        setIsEditing={setIsEditingContact}
                        loading={contactLoading}
                        placeholder="e.g., You can contact me at email@example.com or 0912-345-6789."
                      />
                      
                      {/* Batch Update Button */}
                      {(isEditingPrice || isEditingAvailability || isEditingContact) && (
                        <div className="pt-2">
                          <button
                            onClick={handleBatchUpdate}
                            className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 font-medium text-sm"
                          >
                            Save All Auto-Replies
                          </button>
                        </div>
                      )}
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