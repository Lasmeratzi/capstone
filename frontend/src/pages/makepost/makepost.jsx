import React, { useState } from "react";
import axios from "axios";

const MakePost = ({ onSuccess }) => {
  const [title, setTitle] = useState(""); // State for the title of the post
  const [media, setMedia] = useState(null); // State for the uploaded media
  const [errorMessage, setErrorMessage] = useState(""); // For error handling
  const [successMessage, setSuccessMessage] = useState(""); // For success notifications
  const [isSubmitting, setIsSubmitting] = useState(false); // For loading spinner

  // Handle media file selection
  const handleMediaChange = (e) => {
    setMedia(e.target.files[0]); // Get the first selected file
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setIsSubmitting(true); // Set loading state
    setErrorMessage(""); // Reset any previous errors
    setSuccessMessage(""); // Reset any previous success messages

    try {
      const token = localStorage.getItem("token"); // Get the token from localStorage
      if (!token) {
        setErrorMessage("Unauthorized: Please log in to make a post.");
        setIsSubmitting(false);
        return;
      }

      const formData = new FormData(); // Create a new FormData object
      formData.append("title", title); // Add the title to the form data
      if (media) formData.append("media", media); // Add the media file to the form data (optional)

      // Make the API request
      const response = await axios.post("http://localhost:5000/api/posts", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setIsSubmitting(false); // Stop loading
      setSuccessMessage("Post created successfully!"); // Show success message
      setTitle(""); // Clear the title input
      setMedia(null); // Clear the media input
      if (onSuccess) onSuccess(); // Call the onSuccess callback if provided
    } catch (error) {
      setIsSubmitting(false); // Stop loading
      console.error("Failed to create post:", error);
      setErrorMessage(error.response?.data?.message || "Failed to create post. Please try again.");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Create a New Post</h2>
      {/* Success Message */}
      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
      {/* Error Message */}
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
      {/* Post Creation Form */}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            className="w-full px-3 py-2 border rounded-lg"
            value={title}
            onChange={(e) => setTitle(e.target.value)} // Update the title state
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="media" className="block text-gray-700 font-medium mb-2">
            Media (optional)
          </label>
          <input
            type="file"
            id="media"
            className="w-full"
            accept="image/*,video/*" // Allow images and videos
            onChange={handleMediaChange} // Handle media file change
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600"
          disabled={isSubmitting} // Disable the button when submitting
        >
          {isSubmitting ? "Submitting..." : "Create Post"} {/* Show loading state */}
        </button>
      </form>
    </div>
  );
};

export default MakePost;