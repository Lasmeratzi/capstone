import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; 
import axios from "axios";
import { motion } from "framer-motion"; 

const VisitPortfolio = () => {
  const { id } = useParams(); 
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
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

  const handleImageClick = (item) => setSelectedItem(item);
  const closeModal = () => setSelectedItem(null);

  const handleAutoSendMessage = async (portfolioItem) => {
    try {
      const token = localStorage.getItem("token");

      // ✅ Send message directly (no /autoreply call)
      await axios.post(
  "http://localhost:5000/api/messages",
  {
    recipientId: portfolioItem.user_id,
    portfolioItemId: portfolioItem.id,   // 👈 important
    message_text: "Hi, I’m interested in this portfolio item!",
  },
  { headers: { Authorization: `Bearer ${token}` } }
);


      alert("Message sent successfully!");
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
    <div className="px-6 py-4">
      <h2 className="text-2xl font-bold mb-4">User Portfolio</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolioItems.map((item) => (
          <div
            key={item.id}
            onClick={() => handleImageClick(item)}
            className="group relative cursor-pointer transform transition duration-300 hover:scale-105 w-full h-0 pb-[100%] rounded-lg overflow-hidden"
          >
            <img
              src={`http://localhost:5000/uploads/${item.image_path}`}
              alt={item.title}
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <h3 className="text-white text-lg font-semibold px-4 py-2 rounded-lg">
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
          transition={{ duration: 0.5 }}
          className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full flex relative"
          >
            <div className="w-2/3 flex items-center justify-center">
              <img
                src={`http://localhost:5000/uploads/${selectedItem.image_path}`}
                alt={selectedItem.title}
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-lg"
              />
            </div>

            <div className="w-1/3 pl-6 flex flex-col justify-start">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                {selectedItem.title}
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                {selectedItem.description}
              </p>

              <button
                onClick={() => handleAutoSendMessage(selectedItem)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Message Seller
              </button>
            </div>

            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-700 hover:text-red-500 text-2xl font-bold"
            >
              &times;
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default VisitPortfolio;
