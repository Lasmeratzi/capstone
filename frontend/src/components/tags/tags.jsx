import React, { useState, useEffect } from "react";
import axios from "axios";
import SideAdmin from "../sideadmin/sideadmin";

const Tags = () => {
  const [formData, setFormData] = useState({ tag_name: "", tag_created: "" });
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // Search term for filtering tags
  const [dateFilter, setDateFilter] = useState("Latest"); // Dropdown for date filter

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/tags")
      .then((response) => setTags(response.data))
      .catch(() => alert("Failed to fetch tags. Check your backend setup."));
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/api/tags", formData)
      .then((response) => {
        setTags([...tags, response.data]);
        setFormData({ tag_name: "", tag_created: "" });
        setMessage("Tag created successfully!");
      })
      .catch(() => setMessage("Failed to create tag. Please try again."));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this tag?")) {
      axios
        .delete(`http://localhost:5000/api/tags/${id}`)
        .then(() => setTags(tags.filter((tag) => tag.id !== id)))
        .catch(() => alert("Failed to delete tag. Please try again."));
    }
  };

  const handleUpdate = (tag) => {
    setCurrentTag(tag);
    setShowModal(true);
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:5000/api/tags/${currentTag.id}`, currentTag)
      .then(() => {
        setTags(
          tags.map((tag) =>
            tag.id === currentTag.id ? { ...tag, ...currentTag } : tag
          )
        );
        setShowModal(false);
        alert("Tag updated successfully!");
      })
      .catch(() => alert("Failed to update tag. Please try again."));
  };

  const handleSearch = (e) => setSearchTerm(e.target.value.toLowerCase()); // Search by keyword

  const handleDateFilterChange = (e) => setDateFilter(e.target.value); // Dropdown change handler

  const filteredTags = [...tags]
    .filter((tag) => tag.tag_name.toLowerCase().includes(searchTerm)) // Filter by search term
    .sort((a, b) => {
      if (dateFilter === "Latest") {
        return new Date(b.tag_created) - new Date(a.tag_created); // Descending order
      } else if (dateFilter === "Oldest") {
        return new Date(a.tag_created) - new Date(b.tag_created); // Ascending order
      }
      return 0; // Default case, no sorting
    });

  return (
    <div className="flex h-screen bg-gray-100">
      <SideAdmin />
      <div className="flex-grow p-6">
        <h1 className="text-lg font-bold text-gray-800">Illura Database &gt; Tags</h1>
        <hr className="border-t border-gray-300 mt-2 mb-6" />

        {/* Create Tag Form */}
        <div className="bg-white p-4 shadow-md rounded-lg mb-6">
          <form onSubmit={handleSubmit} className="flex items-center space-x-4">
            <div>
              <label htmlFor="tag_name" className="block text-sm text-gray-600">
                Tag Name
              </label>
              <input
                type="text"
                id="tag_name"
                value={formData.tag_name}
                onChange={handleChange}
                className="w-48 px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Enter Tag Name"
                required
              />
            </div>
            <div>
              <label htmlFor="tag_created" className="block text-sm text-gray-600">
                Date Created
              </label>
              <input
                type="date"
                id="tag_created"
                value={formData.tag_created}
                onChange={handleChange}
                className="w-48 px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <button
              type="submit"
              className="self-end px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Tag
            </button>
          </form>
          {message && <p className="text-sm text-green-500 mt-4">{message}</p>}
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white p-4 shadow-md rounded-lg mb-6 flex items-center space-x-4">
          <div>
            <label htmlFor="search" className="block text-sm text-gray-600">
              Search Tags
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={handleSearch}
              className="w-48 px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter keyword"
            />
          </div>
          <div>
            <label htmlFor="dateFilter" className="block text-sm text-gray-600">
              Filter By
            </label>
            <select
              id="dateFilter"
              value={dateFilter}
              onChange={handleDateFilterChange}
              className="w-48 px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="Latest">Latest</option>
              <option value="Oldest">Oldest</option>
            </select>
          </div>
        </div>

        {/* Tags Table */}
        <div className="bg-white p-4 shadow-md rounded-lg">
          <table className="table-auto w-full text-left border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2">ID</th>
                <th className="border border-gray-300 px-4 py-2">Tag Name</th>
                <th className="border border-gray-300 px-4 py-2">Date Created</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTags.map((tag) => (
                <tr key={tag.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{tag.id}</td>
                  <td className="border border-gray-300 px-4 py-2">{tag.tag_name}</td>
                  <td className="border border-gray-300 px-4 py-2">{tag.tag_created}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      onClick={() => handleUpdate(tag)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(tag.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 ml-2"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 className="text-md font-medium text-gray-800 mb-4">Update Tag</h2>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label htmlFor="tag_name" className="block text-sm text-gray-600">
                  Tag Name
                </label>
                <input
                  type="text"
                  id="tag_name"
                  value={currentTag?.tag_name || ""}
                  onChange={(e) =>
                    setCurrentTag({ ...currentTag, tag_name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label htmlFor="tag_created" className="block text-sm text-gray-600">
                Date Created
                </label>
                <input
                  type="date"
                  id="tag_created"
                  value={currentTag?.tag_created || ""}
                  onChange={(e) =>
                    setCurrentTag({ ...currentTag, tag_created: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
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
               