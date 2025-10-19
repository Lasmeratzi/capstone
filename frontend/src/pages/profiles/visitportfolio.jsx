import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; 
import axios from "axios";
import { motion } from "framer-motion";
import { UserCircleIcon, XMarkIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/20/solid";

const VisitPortfolio = () => {
  const { id } = useParams(); 
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [authorInfo, setAuthorInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleAutoSendMessage = async (portfolioItem) => {
    try {
      const token = localStorage.getItem("token");

      // ✅ Send message directly
      await axios.post(
        "http://localhost:5000/api/messages",
        {
          recipientId: portfolioItem.user_id,
          portfolioItemId: portfolioItem.id,
          message_text: "Hi, I'm interested in this portfolio item!",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Message sent successfully!");
      closeModal();
    } catch (err) {
      console.error("Failed to send message:", err);
      alert("Failed to send message.");
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
            {/* Subtle overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-start p-4">
              <h3 className="text-white text-lg font-semibold drop-shadow-lg">
                {item.title}
              </h3>
            </div>
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

              {/* Message Button */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <button
                  onClick={() => handleAutoSendMessage(selectedItem)}
                  className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium text-sm border border-blue-700 shadow-sm w-auto mx-auto"
                >
                  <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                  Message Seller
                </button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Send a message to inquire about this portfolio item
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default VisitPortfolio;