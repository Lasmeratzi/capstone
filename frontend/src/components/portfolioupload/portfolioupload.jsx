import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Import Framer Motion

const PortfolioUpload = ({ portfolioItem, onSuccess }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (portfolioItem) {
      setTitle(portfolioItem.title || "");
      setDescription(portfolioItem.description || "");
      setImage(null);
    }
  }, [portfolioItem]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    if (image) formData.append("image", image);

    try {
      if (portfolioItem) {
        // Update existing portfolio item
        await axios.patch(`http://localhost:5000/api/portfolio/${portfolioItem.id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setSuccessMessage("Portfolio item updated successfully!");

        if (onSuccess) {
          onSuccess();
        }

        navigate(0); // Reload page to display updated content
      } else {
        // Upload new portfolio item
        await axios.post("http://localhost:5000/api/portfolio", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setSuccessMessage("Portfolio item uploaded successfully!");

        navigate(0); // Reload page to display new content
      }
    } catch (error) {
      console.error("Failed to submit portfolio item:", error);
      setErrorMessage("Failed to submit portfolio item. Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }} // Start slightly faded and scaled down
      animate={{ opacity: 1, scale: 1 }} // Animate to full opacity and size
      exit={{ opacity: 0, scale: 0.9 }} // Smoothly fade and shrink when exiting
      transition={{ duration: 0.5, ease: "easeOut" }} // Smooth timing
      className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold mb-4">
        {portfolioItem ? "Edit Portfolio Item" : "Upload Portfolio Item"}
      </h2>
      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="title">
            Title
          </label>
          <input
            type="text"
            id="title"
            className="w-full px-3 py-2 border rounded-lg"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            className="w-full px-3 py-2 border rounded-lg"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="image">
            Image
          </label>
          <input
            type="file"
            id="image"
            className="w-full"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600"
        >
          {portfolioItem ? "Update" : "Upload"}
        </button>
      </form>
    </motion.div>
  );
};

export default PortfolioUpload;