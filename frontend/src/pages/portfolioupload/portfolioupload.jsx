import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const PortfolioUpload = ({ portfolioItem, onSuccess }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    const token = localStorage.getItem("token");
    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    if (image) formData.append("image", image);

    try {
      if (portfolioItem) {
        await axios.patch(
          `http://localhost:5000/api/portfolio/${portfolioItem.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setSuccessMessage("Portfolio item updated successfully!");

        if (onSuccess) {
          onSuccess();
        }

        navigate(0);
      } else {
        await axios.post("http://localhost:5000/api/portfolio", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setSuccessMessage("Portfolio item uploaded successfully!");
        navigate(0);
      }
    } catch (error) {
      console.error("Failed to submit portfolio item:", error);
      setErrorMessage(
        error.response?.data?.message ||
          "Failed to submit portfolio item. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto my-8 p-8 bg-white rounded-xl shadow-lg"
    >
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800">
          {portfolioItem ? "Edit Portfolio Item" : "Add New Portfolio Item"}
        </h2>
        <p className="text-gray-500 mt-1">
          {portfolioItem
            ? "Update your existing portfolio item"
            : "Showcase your work with a new portfolio item"}
        </p>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            placeholder="Project title"
            required
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description *
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            placeholder="Describe your project..."
            required
          />
        </div>

        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {portfolioItem ? "Update Image" : "Upload Image"}
          </label>
          <div className="mt-1 flex items-center">
            <label className="relative cursor-pointer bg-white rounded-lg border border-gray-300 p-3 w-full hover:border-blue-500 transition-all">
              <div className="flex flex-col items-center justify-center space-y-1">
                <svg
                  className="h-8 w-8 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-sm text-gray-600">
                  {image
                    ? image.name
                    : portfolioItem
                    ? "Select new image to update"
                    : "Click to upload an image"}
                </span>
              </div>
              <input
                id="image"
                name="image"
                type="file"
                className="sr-only"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            PNG, JPG, GIF up to 5MB
          </p>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${
              isSubmitting
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : portfolioItem ? (
              "Update Portfolio Item"
            ) : (
              "Upload Portfolio Item"
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default PortfolioUpload;