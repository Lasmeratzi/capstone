import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import axios from "axios";
import { motion } from "framer-motion";
import { 
  UserCircleIcon, 
  XMarkIcon, 
  ChatBubbleLeftRightIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  PhoneIcon
} from "@heroicons/react/20/solid";

const VisitPortfolio = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [authorInfo, setAuthorInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const fetchPortfolioAndUser = async () => {
      try {
        const token = localStorage.getItem("token");

        // ✅ Fetch logged-in user's profile
        const userResponse = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLoggedInUserId(userResponse.data.id);

        // ✅ Fetch portfolio items of the visited user
        const portfolioResponse = await axios.get(
          `http://localhost:5000/api/portfolio?userId=${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPortfolioItems(portfolioResponse.data);
      } catch (error) {
        console.error("Failed to fetch portfolio or user data:", error);
        setError("Unable to fetch portfolio or user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioAndUser();
  }, [id]);

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
    // Fetch author information for the specific portfolio item
    await fetchAuthorInfo(item.user_id);
  };

  const closeModal = () => setSelectedItem(null);

  // 🔹 Handle different types of inquiries
  const handleInquiry = async (portfolioItem, type) => {
    setIsSending(true);
    try {
      const token = localStorage.getItem("token");
      let message = "";

      // Custom messages for each inquiry type
      switch(type) {
        case 'price':
          message = `Hi! I'm interested in "${portfolioItem.title}". How much does this cost?`;
          break;
        case 'availability':
          message = `Hi! Is "${portfolioItem.title}" still available?`;
          break;
        case 'contact':
          message = `Hi! Could you share your contact details for "${portfolioItem.title}"?`;
          break;
        default:
          message = `Hi! I'm interested in "${portfolioItem.title}"!`;
      }

      // ✅ Send message
      await axios.post(
        "http://localhost:5000/api/messages",
        {
          recipientId: portfolioItem.user_id,
          portfolioItemId: portfolioItem.id,
          message_text: message,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(`${type === 'price' ? 'Price' : type === 'availability' ? 'Availability' : 'Contact'} inquiry sent successfully!`);
      closeModal();
    } catch (err) {
      console.error("Failed to send message:", err);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  // 🔹 Handle custom message (opens inbox)
  const handleCustomMessage = () => {
    if (selectedItem) {
      navigate(`/inbox?user=${selectedItem.user_id}&portfolio=${selectedItem.id}`);
      closeModal();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading portfolio...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  if (portfolioItems.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        No portfolio items found.
      </div>
    );
  }

  return (
    <div className="px-4 py-4 max-w-7xl mx-auto">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolioItems.map((item) => (
          <div
            key={item.id}
            onClick={() => handleImageClick(item)}
            className="group relative cursor-pointer transform transition-all duration-300 hover:scale-105 w-full h-0 pb-[100%] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl border border-gray-200"
          >
            <img
              src={`http://localhost:5000/uploads/${item.image_path}`}
              alt={item.title}
              className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />

            {/* SOLD Overlay */}
            {item.is_sold && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10">
                <div className="text-center p-4">
                  <div className="bg-red-600 text-white font-bold text-xl px-6 py-3 rounded-lg mb-2 transform rotate-[-5deg] shadow-lg">
                    🏆 SOLD 🏆
                  </div>
                  <p className="text-white text-sm font-medium">Auction Completed</p>
                  {item.final_price && (
                    <p className="text-yellow-300 text-lg font-bold mt-2">
                      Sold for: ₱{Number(item.final_price).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Subtle overlay on hover (only show if not sold) */}
            {!item.is_sold && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-start p-4">
                <h3 className="text-white text-lg font-semibold drop-shadow-lg">
                  {item.title}
                </h3>
              </div>
            )}
          </div>
        ))}
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
              {/* Header with Close Button */}
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

                {/* Close Button */}
                <button
                  onClick={closeModal}
                  className="flex items-center p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 border border-transparent hover:border-gray-300"
                  disabled={isSending}
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

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

              {/* Auction Information - Show if sold */}
              {selectedItem.is_sold && selectedItem.auction_id && (
                <div className="mt-6 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-300 shadow-md">
                  <div className="flex items-center mb-4">
                    <CurrencyDollarIcon className="h-6 w-6 text-yellow-600 mr-2" />
                    <h3 className="text-lg font-bold text-gray-900">Auction Results</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Starting Price:</span>
                      <span className="text-gray-900 font-semibold">
                        ₱{Number(selectedItem.starting_price).toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Final Price:</span>
                      <span className="text-green-600 font-bold text-xl">
                        ₱{Number(selectedItem.final_price || selectedItem.current_price).toLocaleString()}
                      </span>
                    </div>
                    
                    {selectedItem.winner_username && (
                      <div className="flex justify-between items-center pt-2 border-t border-yellow-200">
                        <span className="text-gray-600 font-medium">Winner:</span>
                        <span className="text-gray-900 font-semibold">
                          @{selectedItem.winner_username}
                        </span>
                      </div>
                    )}
                    
                    <div className="mt-4 pt-3 border-t border-yellow-200">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-300">
                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                        Auction Completed
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Inquiry Buttons Section - Only show if NOT sold */}
              {!selectedItem.is_sold && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4 text-center">
                    Quick Inquiries
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {/* Price Inquiry Button */}
                    <button
                      onClick={() => handleInquiry(selectedItem, 'price')}
                      disabled={isSending}
                      className={`flex flex-col items-center justify-center px-3 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all duration-200 font-medium text-sm border border-blue-200 shadow-sm ${
                        isSending ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-300'
                      }`}
                    >
                      <CurrencyDollarIcon className="h-5 w-5 mb-1" />
                      <span>How much?</span>
                    </button>
                    
                    {/* Availability Inquiry Button */}
                    <button
                      onClick={() => handleInquiry(selectedItem, 'availability')}
                      disabled={isSending}
                      className={`flex flex-col items-center justify-center px-3 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-all duration-200 font-medium text-sm border border-green-200 shadow-sm ${
                        isSending ? 'opacity-50 cursor-not-allowed' : 'hover:border-green-300'
                      }`}
                    >
                      <CheckCircleIcon className="h-5 w-5 mb-1" />
                      <span>Available?</span>
                    </button>
                    
                    {/* Contact Inquiry Button */}
                    <button
                      onClick={() => handleInquiry(selectedItem, 'contact')}
                      disabled={isSending}
                      className={`flex flex-col items-center justify-center px-3 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-all duration-200 font-medium text-sm border border-purple-200 shadow-sm ${
                        isSending ? 'opacity-50 cursor-not-allowed' : 'hover:border-purple-300'
                      }`}
                    >
                      <PhoneIcon className="h-5 w-5 mb-1" />
                      <span>Contact</span>
                    </button>
                    
                    {/* Custom Message Button */}
                    <button
                      onClick={handleCustomMessage}
                      className="flex flex-col items-center justify-center px-3 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-200 font-medium text-sm border border-gray-200 shadow-sm hover:border-gray-300"
                    >
                      <ChatBubbleLeftRightIcon className="h-5 w-5 mb-1" />
                      <span>Message</span>
                    </button>
                  </div>
                  
                  <p className="text-xs text-gray-500 text-center">
                    {isSending ? (
                      <span className="text-blue-600">Sending inquiry...</span>
                    ) : (
                      "Click any button to send an inquiry. Auto-reply will be sent instantly."
                    )}
                  </p>
                </div>
              )}

              {/* Message for sold items */}
              {selectedItem.is_sold && (
                <div className="mt-8 pt-8 border-t border-gray-200 text-center">
                  <p className="text-gray-500 text-sm">
                    This item has been sold through auction and is no longer available for inquiries.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default VisitPortfolio;