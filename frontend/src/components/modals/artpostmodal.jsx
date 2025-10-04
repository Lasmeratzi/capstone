import React, { useState, useEffect } from "react";
import { X, Loader } from "lucide-react";
import axios from "axios";

const API_BASE = "http://localhost:5000";

const ArtPostModal = ({ type, post, onClose, onDelete, onEdit }) => {
  const [title, setTitle] = useState(post?.title || "");
  const [description, setDescription] = useState(post?.description || "");
  const [loading, setLoading] = useState(false);

  const [mediaList, setMediaList] = useState([]);
  const [newMedia, setNewMedia] = useState([]);
  const [removedMediaIds, setRemovedMediaIds] = useState([]);

  const token = localStorage.getItem("token");

  const fetchMediaList = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/artwork-media/${post.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMediaList(res.data);
    } catch (err) {
      console.error("Error loading media:", err);
    }
  };

  useEffect(() => {
    if (post?.id) {
      fetchMediaList();
    }
  }, [post?.id, token]);

  const handleRemoveMedia = (mediaId) => {
    if (!window.confirm("Are you sure you want to remove this image?")) return;
    setRemovedMediaIds((prev) => [...prev, mediaId]);
    setMediaList((prev) => prev.filter((media) => media.id !== mediaId));
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete(post.id);
      onClose();
    } catch (err) {
      console.error("Failed to delete:", err);
      alert("Error deleting post.");
    } finally {
      setLoading(false);
    }
  };

const handleEdit = async () => {
  setLoading(true);

  let mainUpdateSuccess = false;

  try {
    // Step 1 — Update title & description
    const res = await axios.patch(
      `${API_BASE}/api/artwork-posts/${post.id}`,
      { title, description },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.status >= 200 && res.status < 300) {
      mainUpdateSuccess = true;
    }
  } catch (err) {
    console.error("Failed to update post:", err.response?.data || err.message);
  }

  // Step 2 — Remove media if needed
  for (const id of removedMediaIds) {
    try {
      await axios.delete(
        `${API_BASE}/api/artwork-media/file/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.warn(`Failed to delete media ${id}:`, err.response?.data || err.message);
    }
  }

  // Step 3 — Upload new media if provided
  if (newMedia.length > 0) {
    const formData = new FormData();
    newMedia.forEach((file) => formData.append("media", file));
    formData.append("post_id", post.id);

    try {
      await axios.post(`${API_BASE}/api/artwork-media`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (err) {
      console.warn("Failed to upload new media:", err.response?.data || err.message);
    }
  }

  if (mainUpdateSuccess) {
    setLoading(false);
    onClose(); // Close modal
    window.location.reload(); // Force refresh so new images load
  } else {
    setLoading(false);
    alert("Failed to edit post.");
  }
};


  return (
    <div className="fixed inset-0 bg-gray-900/75 backdrop-blur-md flex justify-center items-center z-50">
      <div
        className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X size={24} />
        </button>

        {type === "delete" && (
          <div>
            <h2 className="text-xl font-bold mb-4 text-red-600">Confirm Delete</h2>
            <p className="mb-4">
              Are you sure you want to delete "<b>{post.title}</b>"? This cannot
              be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        )}

        {type === "edit" && (
          <div>
            <h2 className="text-xl font-bold mb-4">Edit Artwork Post</h2>

            <div className="mb-4">
              <label className="block mb-1 font-medium">Title</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium">Description</label>
              <textarea
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-medium">Current Media</label>
              <div className="flex flex-wrap gap-2">
                {mediaList.map((media) => (
                  <div key={media.id} className="relative">
                    <img
                      src={`${API_BASE}/uploads/artwork/${media.media_path}`}
                      alt="Artwork"
                      className="w-20 h-20 object-cover rounded"
                    />
                    <button
                      onClick={() => handleRemoveMedia(media.id)}
                      className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block font-medium mb-2">Add Images</label>
              <input
                type="file"
                multiple
                onChange={(e) => setNewMedia([...e.target.files])}
                className="block w-full text-sm text-gray-500"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition font-medium"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                className={`px-5 py-2 rounded-lg text-white font-medium ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                disabled={loading}
              >
                {loading ? <Loader className="animate-spin w-5 h-5 inline" /> : "Save"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtPostModal;
