import React, { useState } from "react";
import axios from "axios";

const MakePost = ({ loggedInUser }) => {
  const [content, setContent] = useState(""); // Post content
  const [mediaFile, setMediaFile] = useState(null); // Optional media file (image/video)
  const [message, setMessage] = useState(""); // Feedback message
  const [messageType, setMessageType] = useState(""); // Type of message (success or error)
  const [loading, setLoading] = useState(false); // Loading state

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      setMessageType("error"); // Set the message type to error
      setMessage("Post content cannot be empty.");
      return;
    }

    if (!loggedInUser.id) {
      setMessageType("error"); // Set the message type to error
      setMessage("Error: User ID is missing.");
      return;
    }

    setLoading(true);
    try {
      console.log("Logged-in User ID:", loggedInUser.id); // Debug log for ID
      const token = sessionStorage.getItem("token"); // Retrieve token from session storage
      const formData = new FormData(); // Use FormData for file uploads
      formData.append("content", content); // Post content
      formData.append("media_file", mediaFile); // Media file (image/video)
      formData.append("author_id", loggedInUser.id); // Pass the author's ID

      // Use axios to send the request
      const response = await axios.post("http://localhost:5000/api/posts", formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token
          "Content-Type": "multipart/form-data", // Ensure correct content type
        },
      });

      setContent(""); // Clear the post content
      setMediaFile(null); // Clear media file field
      setMessageType("success"); // Set the message type to success
      setMessage("Post created successfully!");
    } catch (error) {
      console.error("Error creating post:", error);
      const errorMessage =
        error.response?.data?.message || "An error occurred while submitting the post.";
      setMessageType("error"); // Set the message type to error
      setMessage(`Failed to create post: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="make-post flex justify-center mt-1 p-0">
      <div className="w-full max-w-lg p-4 bg-white shadow-md rounded-md">
        <h2 className="mb-4 text-center font-bold text-lg">Create a Post</h2>
        <form onSubmit={handleSubmit} className="space-y-2">
          {/* Post Content */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            rows="3"
            className="w-full p-2 border rounded resize-none"
            required
          ></textarea>

          {/* Media File */}
          <div>
            <label className="block text-sm font-semibold mb-1">Upload a picture or video:</label>
            <input
              type="file"
              onChange={(e) => setMediaFile(e.target.files[0])} // Save the selected file
              accept="image/*,video/*" // Restrict to image and video files
              className="w-full border rounded p-2"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`bg-blue-500 text-white px-4 py-2 rounded ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </form>

        {/* Feedback Message */}
        {message && (
          <p
            className={`mt-4 text-center ${
              messageType === "success" ? "text-green-500" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default MakePost;