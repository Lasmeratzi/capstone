import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

export default function MakeArt({ onClose }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [tagSuggestions, setTagSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    return () => {
      filePreviews.forEach(preview => {
        URL.revokeObjectURL(preview.preview);
      });
    };
  }, [filePreviews]);

  // Fetch tag suggestions as user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (tagInput.length >= 2) {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/tags/search?query=${tagInput}`,
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
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
  }, [tagInput]);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    if (newFiles.length) {
      setFiles([...files, ...newFiles]);
      
      const newPreviews = newFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      setFilePreviews([...filePreviews, ...newPreviews]);
    }
  };

  const removeFile = (index) => {
    const newFiles = [...files];
    const newPreviews = [...filePreviews];
    URL.revokeObjectURL(newPreviews[index].preview);
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    setFiles(newFiles);
    setFilePreviews(newPreviews);
  };

  // Add tag when user presses Enter or clicks suggestion
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
      // Remove last tag if input is empty and user presses backspace
      setTags(tags.slice(0, -1));
    }
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!title || !description || files.length === 0) {
      setError("Title, description, and at least one image are required.");
      return;
    }

    try {
      setSubmitting(true);
      
      // Create post with tags
      const postResponse = await axios.post(
        "http://localhost:5000/api/artwork-posts",
        { title, description, tags }, // ✅ Include tags
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      const postId = postResponse.data.postId;
      
      // Upload media
      const formData = new FormData();
      formData.append("post_id", postId);
      files.forEach((file) => formData.append("media", file));

      await axios.post("http://localhost:5000/api/artwork-media", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setSuccess("Artwork posted successfully!");
      setTitle("");
      setDescription("");
      setFiles([]);
      setFilePreviews([]);
      setTags([]);

      onClose();
      navigate("/home");
      window.location.reload();

    } catch (error) {
      console.error("Error uploading artwork:", error);
      setError(error.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/75 backdrop-blur-md flex items-center justify-center p-4 z-50 transition-all duration-200 ease-in-out">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden" style={{ maxHeight: '90vh' }}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-gray-50 px-6 py-2 border-b border-gray-200">
            <h1 className="text-xl font-semibold text-gray-800">Create Artwork Post</h1>
          </div>
          
          {/* Body */}
          <div className="flex-1 overflow-auto px-8 pt-2 pb-8">
            {success && (
              <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
                {success}
              </div>
            )}
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-6">
                {/* Left side - Text fields */}
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      rows={5}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                  </div>

                  {/* Tags Input */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tags (optional) <span className="text-gray-500 text-xs">- Max 10</span>
                    </label>
                    
                    {/* Display added tags */}
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
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
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
                </div>

                {/* Right side - Image upload */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Images <span className="text-red-500">*</span>
                  </label>
                  
                  {/* Square image previews */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {filePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview.preview}
                          alt={`Preview ${index}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="absolute top-1 right-1 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* File upload area */}
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-3 pb-4">
                        <svg className="w-6 h-6 mb-2 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                        </svg>
                        <p className="text-xs text-gray-500">
                          <span className="font-medium">Click to upload</span>
                        </p>
                      </div>
                      <input 
                        id="dropzone-file" 
                        type="file" 
                        multiple 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Community Guidelines */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Posting Guidelines</h3>
                <ul className="text-xs text-gray-600 space-y-1.5">
                  <li className="flex items-start">
                    <span className="text-gray-400 mr-1.5">•</span>
                    <span>Only share original artwork you've created</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-400 mr-1.5">•</span>
                    <span>Always credit references or inspiration sources</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-400 mr-1.5">•</span>
                    <span>Use relevant tags to help others discover your work</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-400 mr-1.5">•</span>
                    <span>Be respectful of other artists' work and copyrights</span>
                  </li>
                </ul>
              </div>

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
                  disabled={submitting}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                    submitting 
                      ? "bg-blue-400 cursor-not-allowed" 
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {submitting ? "Uploading..." : "Post Artwork"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}