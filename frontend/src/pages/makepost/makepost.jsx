import React, { useState } from "react";
import axios from "axios";

const MakePost = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visibility, setVisibility] = useState("private"); // Default to private

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMedia(file);
      setMediaPreview(URL.createObjectURL(file));
    }
  };

  const clearMedia = () => {
    setMedia(null);
    setMediaPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMessage("Please log in to make a post.");
        setIsSubmitting(false);
        return;
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("visibility", visibility); // Add visibility to form data
      if (media) formData.append("media", media);

      await axios.post("http://localhost:5000/api/posts", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccessMessage("Post created successfully!");
      setTitle("");
      setMedia(null);
      setMediaPreview(null);
      setVisibility("private"); // Reset to private

      if (onClose) onClose(); // close modal on success
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to create post."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/75 backdrop-blur-md flex items-center justify-center p-4 z-50 transition-all duration-200 ease-in-out">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg border border-gray-200 p-6 relative">
        {/* X Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Create New Post
        </h2>

        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Visibility Selector */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Who can see this?
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setVisibility("public")}
                className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  visibility === "public"
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span className="text-lg">🌍</span>
                <div className="text-left">
                  <div className="font-semibold">Public</div>
                  <div className="text-xs opacity-80">Everyone on Illura</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setVisibility("friends")}
                className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  visibility === "friends"
                    ? "bg-green-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span className="text-lg">👥</span>
                <div className="text-left">
                  <div className="font-semibold">Friends Only</div>
                  <div className="text-xs opacity-80">Mutual followers</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setVisibility("private")}
                className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  visibility === "private"
                    ? "bg-gray-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span className="text-lg">🔒</span>
                <div className="text-left">
                  <div className="font-semibold">Private</div>
                  <div className="text-xs opacity-80">Only you</div>
                </div>
              </button>
            </div>
            
            <p className="text-xs text-gray-500 mt-3">
              {visibility === "public" && 
                "🌍 Your post will be visible to all users on Illura, including non-followers."}
              {visibility === "friends" && 
                "👥 Only users who follow each other (mutual follows) can see this post."}
              {visibility === "private" && 
                "🔒 This post is only visible to you. Perfect for drafts or personal notes."}
            </p>
          </div>

          {/* Media Upload */}
          <div>
            <label
              htmlFor="media"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Media (optional)
            </label>

            {mediaPreview ? (
              <div className="relative group">
                {media.type.startsWith("image/") ? (
                  <img
                    src={mediaPreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg border border-gray-200"
                  />
                ) : (
                  <video
                    src={mediaPreview}
                    controls
                    className="w-full h-64 object-cover rounded-lg border border-gray-200"
                  />
                )}
                <button
                  type="button"
                  onClick={clearMedia}
                  className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-4 text-gray-500"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      Images or videos (max 10MB)
                    </p>
                  </div>
                  <input
                    id="media"
                    type="file"
                    className="hidden"
                    accept="image/*,video/*"
                    onChange={handleMediaChange}
                  />
                </label>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                isSubmitting
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? "Creating..." : "Create Post"}
            </button>
          </div>

          <div className="text-xs text-gray-500 text-center mt-4">
            Please ensure your post adheres to our community guidelines.
          </div>
        </form>
      </div>
    </div>
  );
};

export default MakePost;