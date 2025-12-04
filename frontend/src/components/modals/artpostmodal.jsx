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

  // Tag states
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [tagSuggestions, setTagSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

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

  // Fetch existing tags for the post
  const fetchPostTags = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/tags/post/${post.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTags(response.data.map(tag => tag.name));
    } catch (err) {
      console.error("Error fetching post tags:", err);
    }
  };

  // Fetch tag suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (tagInput.length >= 2) {
        try {
          const response = await axios.get(
            `${API_BASE}/api/tags/search?query=${tagInput}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setTagSuggestions(response.data);
          setShowSuggestions(true);
        } catch (err) {
          console.error("Error fetching tag suggestions:", err);
        }
      } else {
        setTagSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [tagInput, token]);

  useEffect(() => {
    if (post?.id) {
      fetchMediaList();
      if (type === "edit") {
        fetchPostTags();
      }
    }
  }, [post?.id, token]);

  const handleRemoveMedia = (mediaId) => {
    if (!window.confirm("Are you sure you want to remove this image?")) return;
    setRemovedMediaIds((prev) => [...prev, mediaId]);
    setMediaList((prev) => prev.filter((media) => media.id !== mediaId));
  };

  // Add tag
  const addTag = (tagName) => {
    const cleanTag = tagName.trim().toLowerCase();
    if (cleanTag && !tags.includes(cleanTag) && tags.length < 10) {
      setTags([...tags, cleanTag]);
      setTagInput("");
      setShowSuggestions(false);
    }
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (tagInput.trim()) {
        addTag(tagInput);
      }
    } else if (e.key === "Backspace" && !tagInput && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
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
      // Step 1 — Update title, description, and tags
      const res = await axios.patch(
        `${API_BASE}/api/artwork-posts/${post.id}`,
        { 
          title, 
          description,
          tags // Include the updated tags array
        },
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
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto"
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

            {/* Tags Editing Section */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">
                Tags <span className="text-gray-500 text-xs">- Max 10</span>
              </label>
              
              {/* Display current tags */}
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>

              {/* Tag input field */}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                onFocus={() => tagSuggestions.length > 0 && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Type and press Enter to add tags..."
                disabled={tags.length >= 10}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              />

              {/* Tag suggestions dropdown */}
              {showSuggestions && tagSuggestions.length > 0 && (
                <div className="absolute z-10 w-full max-w-2xl mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {tagSuggestions.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      type="button"
                      onClick={() => addTag(suggestion.name)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm flex items-center justify-between"
                    >
                      <span>#{suggestion.name}</span>
                      <span className="text-xs text-gray-500">
                        {suggestion.usage_count} posts
                      </span>
                    </button>
                  ))}
                </div>
              )}

              <p className="text-xs text-gray-500 mt-1">
                Press Enter to add tags. Separate multiple tags with Enter.
              </p>
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

            <div className="mb-6">
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
                {loading ? <Loader className="animate-spin w-5 h-5 inline" /> : "Save Changes"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtPostModal;