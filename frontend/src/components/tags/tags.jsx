import React, { useState, useEffect } from "react";
import axios from "axios";
import Sideadmin from "../sideadmin/sideadmin";

const Tags = () => {
  const [formData, setFormData] = useState({
    tag_name: "",
    tag_created: "",
  });
  const [tags, setTags] = useState([]);
  const [message, setMessage] = useState("");
  const [currentTag, setCurrentTag] = useState(null);
  const [expandedTag, setExpandedTag] = useState(null); // Tracks expanded tag for dropdown
  const [showModal, setShowModal] = useState(false); // To show/hide update modal

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/tags")
      .then((response) => setTags(response.data))
      .catch((error) => console.error("Error fetching tags:", error));
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:5000/api/tags", formData)
      .then((response) => {
        setMessage("Tag created successfully!");
        setFormData({ tag_name: "", tag_created: "" });
        setTags([...tags, response.data]);
      })
      .catch((error) => {
        console.error("Error creating tag:", error);
        setMessage("Failed to create tag. Please try again.");
      });
  };

  const handleTagClick = (id) => {
    setExpandedTag(expandedTag === id ? null : id); // Toggle dropdown
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this tag?")) {
      axios
        .delete(`http://localhost:5000/api/tags/${id}`)
        .then(() => {
          setTags(tags.filter((tag) => tag.id !== id));
          alert("Tag deleted successfully.");
        })
        .catch((error) => {
          console.error("Error deleting tag:", error);
          alert("Failed to delete tag. Please try again.");
        });
    }
  };

  const handleUpdate = (tag) => {
    setCurrentTag(tag);
    setShowModal(true);
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();

    axios
      .put(`http://localhost:5000/api/tags/${currentTag.id}`, {
        tag_name: currentTag.tag_name,
        tag_created: currentTag.tag_created,
      })
      .then(() => {
        setTags(
          tags.map((tag) =>
            tag.id === currentTag.id
              ? { ...tag, tag_name: currentTag.tag_name, tag_created: currentTag.tag_created }
              : tag
          )
        );
        setShowModal(false);
        alert("Tag updated successfully.");
      })
      .catch((error) => {
        console.error("Error updating tag:", error);
        alert("Failed to update tag. Please try again.");
      });
  };

  return (
    <div className="flex h-screen">
      <Sideadmin />

      {/* Main Content */}
      <div className="flex-grow bg-gray-100 p-6 flex">
        {/* Form Section */}
        <div className="w-1/3 bg-white p-6 shadow-lg rounded-lg">
          <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">Create a Tag</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="tag_name" className="block text-sm font-medium text-gray-700">
                Tag Name
              </label>
              <input
                type="text"
                id="tag_name"
                value={formData.tag_name}
                onChange={handleChange}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Tag Name"
                required
              />
            </div>
            <div>
              <label htmlFor="tag_created" className="block text-sm font-medium text-gray-700">
                Date Created
              </label>
              <input
                type="date"
                id="tag_created"
                value={formData.tag_created}
                onChange={handleChange}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Create Tag
            </button>
          </form>
          {message && <p className="text-center text-green-500 mt-4">{message}</p>}
        </div>

        {/* Tags Section */}
        <div className="w-2/3 bg-white p-6 shadow-lg rounded-lg ml-6">
          <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">Existing Tags</h1>
          <div className="flex flex-wrap gap-3">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className={`px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-center cursor-pointer hover:bg-gray-200 ${
                  expandedTag === tag.id ? "bg-gray-100" : "bg-gray-50"
                }`}
                style={{ width: `${tag.tag_name.length * 15}px` }} // Dynamic width based on tag name length
                onClick={() => handleTagClick(tag.id)}
              >
                <span className="font-semibold">{tag.tag_name}</span>
                {expandedTag === tag.id && (
                  <div className="mt-2 text-sm text-gray-700">
                    <p>ID: {tag.id}</p>
                    <p>Created: {tag.tag_created}</p>
                    <div className="flex justify-center gap-2 mt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdate(tag);
                        }}
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        Update
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(tag.id);
                        }}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Update Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Update Tag</h2>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label htmlFor="tag_name" className="block text-sm font-medium text-gray-700">
                  Tag Name
                </label>
                <input
                  type="text"
                  id="tag_name"
                  value={currentTag?.tag_name || ""}
                  onChange={(e) =>
                    setCurrentTag({ ...currentTag, tag_name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="tag_created" className="block text-sm font-medium text-gray-700">
                  Date Created
                </label>
                <input
                  type="date"
                  id="tag_created"
                  value={currentTag?.tag_created || ""}
                  onChange={(e) =>
                    setCurrentTag({ ...currentTag, tag_created: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tags;