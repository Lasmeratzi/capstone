// src/pages/profiles/PortfolioGrid.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/20/solid";

const PortfolioGrid = ({ portfolioItems, loggedInUserId }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  // Auto-reply states
  const [autoReplyText, setAutoReplyText] = useState("");
  const [hasAutoReply, setHasAutoReply] = useState(false);

  const navigate = useNavigate();

  const handleImageClick = async (item) => {
    setSelectedItem(item);
    setTitle(item.title);
    setDescription(item.description);
    setImage(null);

    // 🔹 Fetch auto-reply for this portfolio item
    try {
      const res = await axios.get(
        `http://localhost:5000/api/auto-replies/${item.id}`
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
    }
  };

  const closeModal = () => {
    setSelectedItem(null);
    setIsEditing(false);
    setTitle("");
    setDescription("");
    setImage(null);
    setAutoReplyText("");
    setHasAutoReply(false);
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
  const handleAddAutoReply = async (portfolioItemId, reply_text) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://localhost:5000/api/auto-replies",
        { portfolioItemId, reply_text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHasAutoReply(true);
      alert("Auto-reply added!");
    } catch (error) {
      console.error(
        "Failed to add auto-reply:",
        error.response?.data || error.message
      );
    }
  };

  const handleUpdateAutoReply = async (portfolioItemId, reply_text) => {
    const token = localStorage.getItem("token");
    try {
      await axios.patch(
        `http://localhost:5000/api/auto-replies/${portfolioItemId}`,
        { reply_text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Auto-reply updated!");
    } catch (error) {
      console.error(
        "Failed to update auto-reply:",
        error.response?.data || error.message
      );
    }
  };

  const handleDeleteAutoReply = async (portfolioItemId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(
        `http://localhost:5000/api/auto-replies/${portfolioItemId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAutoReplyText("");
      setHasAutoReply(false);
      alert("Auto-reply deleted!");
    } catch (error) {
      console.error(
        "Failed to delete auto-reply:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolioItems.length === 0 ? (
          <p className="text-gray-500 col-span-full text-center">
            No portfolio items to display.
          </p>
        ) : (
          portfolioItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleImageClick(item)}
              className="group relative cursor-pointer transform transition duration-300 hover:scale-105 w-full h-0 pb-[100%] rounded-lg overflow-hidden"
              style={{ position: "relative" }}
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
          ))
        )}
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
              {isEditing ? (
                <>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg mb-4"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Edit title"
                  />
                  <textarea
                    className="w-full px-3 py-2 border rounded-lg mb-4"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Edit description"
                  ></textarea>
                  <input
                    type="file"
                    className="w-full mb-4"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <button
                    onClick={handleEditSubmit}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 flex items-center mb-2"
                  >
                    Save Changes
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-gray-800 mb-2">
                    {selectedItem.title}
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    {selectedItem.description}
                  </p>
                </>
              )}

              {/* ✅ Owner-only actions */}
              {!isEditing &&
                Number(selectedItem.user_id) === Number(loggedInUserId) && (
                  <>
                    {/* Edit/Delete Portfolio Item */}
                    <div className="flex justify-end space-x-4 mt-auto mb-4">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center text-blue-500 hover:text-blue-600 transition"
                      >
                        <PencilSquareIcon className="h-5 w-5 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(selectedItem.id)}
                        className="flex items-center text-red-500 hover:text-red-600 transition"
                      >
                        <TrashIcon className="h-5 w-5 mr-1" />
                        Remove
                      </button>
                    </div>

                    {/* 🔹 Auto-reply Section */}
                    <div className="mt-4 border-t pt-4">
                      <h3 className="text-lg font-semibold mb-2">
                        Auto Reply
                      </h3>
                      <textarea
                        className="w-full px-3 py-2 border rounded-lg mb-2"
                        placeholder="Set your auto reply message"
                        value={autoReplyText}
                        onChange={(e) => setAutoReplyText(e.target.value)}
                      ></textarea>

                      {!hasAutoReply ? (
                        <button
                          onClick={() =>
                            handleAddAutoReply(
                              selectedItem.id,
                              autoReplyText
                            )
                          }
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        >
                          Save Auto Reply
                        </button>
                      ) : (
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              handleUpdateAutoReply(
                                selectedItem.id,
                                autoReplyText
                              )
                            }
                            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                          >
                            Update Auto Reply
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteAutoReply(selectedItem.id)
                            }
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                          >
                            Delete Auto Reply
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
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

export default PortfolioGrid;
