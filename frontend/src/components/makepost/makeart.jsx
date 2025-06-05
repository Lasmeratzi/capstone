import React, { useState } from "react";
import axios from "axios";

export default function MakeArt() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFiles(e.target.files.length ? Array.from(e.target.files) : []);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (!title || !description || files.length === 0) {
    setError("Title, description, and images are required.");
    return;
  }

  try {
    setSubmitting(true);

    // Step 1: Create the artwork post
    const postResponse = await axios.post("http://localhost:5000/api/artwork-posts", {
      title,
      description,
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    const postId = postResponse.data.postId; // Get new post ID

    // Step 2: Upload images linked to this post ID
    const formData = new FormData();
    formData.append("post_id", postId);
    files.forEach((file) => formData.append("media", file));

    await axios.post("http://localhost:5000/api/artwork-media", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    alert("Artwork post and media uploaded successfully!");
    setTitle("");
    setDescription("");
    setFiles([]);

  } catch (error) {
    console.error("Error uploading artwork:", error);
    setError(error.response?.data?.message || "Upload failed. Try again.");
  } finally {
    setSubmitting(false);
  }
};

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      <h1 className="text-2xl font-bold mb-4">Create New Artwork Post</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Upload Images (multiple)</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            required
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
              file:rounded file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition"
        >
          {submitting ? "Submitting..." : "Create Artwork Post"}
        </button>
      </form>
    </div>
  );
}