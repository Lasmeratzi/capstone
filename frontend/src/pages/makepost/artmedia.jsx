import React, { useState } from "react";
import axios from "axios";

const ArtMediaUpload = ({ postId, onUploadSuccess }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files)); // Store multiple files
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      setErrorMessage("Please select at least one file to upload.");
      return;
    }

    try {
      setUploading(true);
      setErrorMessage("");

      const formData = new FormData();
      formData.append("post_id", postId); // Ensure post ID is included
      files.forEach((file) => formData.append("media", file)); // Handle multiple files

      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/artwork-media", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setFiles([]);
      onUploadSuccess && onUploadSuccess(); // Optional parent refresh callback
    } catch (error) {
      console.error("Upload failed:", error);
      setErrorMessage(error.response?.data?.message || "Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border p-4 rounded shadow-sm mb-4">
      <h2 className="text-lg font-semibold mb-2">Upload Artwork Media</h2>
      <form onSubmit={handleUpload}>
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileChange}
          className="mb-3"
        />
        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
        <button
          type="submit"
          disabled={uploading}
          className="px-4 py-2 bg-blue-500 text-white font-medium rounded hover:bg-blue-600 transition text-sm"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
};

export default ArtMediaUpload;