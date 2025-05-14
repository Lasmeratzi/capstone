import React, { useState, useEffect } from "react";
import axios from "axios";
import SideAdmin from "../sideadmin/sideadmin"; // Admin sidebar for navigation
import { TrashIcon, EyeIcon, EyeSlashIcon, XMarkIcon } from "@heroicons/react/24/outline";

const DisplayPosts = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState(null); // For viewing post images

  // Fetch all posts when component loads
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:5000/api/posts", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setPosts(response.data))
      .catch(() => alert("Failed to fetch posts."));
  }, []);

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
  };

  // Toggle post status (Active ↔ Down)
  const togglePostStatus = (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "down" : "active";
    const token = localStorage.getItem("token");

    axios
      .patch(
        `http://localhost:5000/api/posts/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setPosts(
          posts.map((post) =>
            post.id === id ? { ...post, post_status: newStatus } : post
          )
        );
        alert(`Post status changed to ${newStatus}!`);
      })
      .catch(() => alert("Failed to update post status."));
  };

  // Delete post
  const deletePost = (id) => {
    const token = localStorage.getItem("token");

    axios
      .delete(`http://localhost:5000/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setPosts(posts.filter((post) => post.id !== id));
        alert("Post deleted successfully!");
      })
      .catch(() => alert("Failed to delete post."));
  };

  // Open image modal
  const openImageModal = (imagePath) => {
    setSelectedImage(imagePath);
  };

  // Close image modal
  const closeImageModal = () => {
    setSelectedImage(null);
  };

  // Handle search input
  const handleSearch = (e) => setSearchTerm(e.target.value.toLowerCase());

  // Filter posts by title
  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm)
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <SideAdmin /> {/* Sidebar for navigation */}
      <div className="flex-grow p-6">
        <h1 className="text-lg font-bold text-gray-800">Illura Database &gt; Posts</h1>
        <hr className="border-t border-gray-300 mt-2 mb-6" />

        {/* Search Section */}
        <div className="bg-white p-4 shadow-md rounded-lg mb-6">
          <label htmlFor="search" className="block text-sm text-gray-600">
            Search Posts
          </label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={handleSearch}
            className="w-48 px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Enter post title"
          />
        </div>

        {/* Posts Table */}
        <div className="bg-white p-4 shadow-md rounded-lg">
          <table className="table-auto w-full text-left border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2">ID</th>
                <th className="border border-gray-300 px-4 py-2">Title</th>
                <th className="border border-gray-300 px-4 py-2">Author</th>
                <th className="border border-gray-300 px-4 py-2">Image</th>
                <th className="border border-gray-300 px-4 py-2">Status</th>
                <th className="border border-gray-300 px-4 py-2">Created At</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{post.id}</td>
                  <td className="border border-gray-300 px-4 py-2">{post.title}</td>
                  <td className="border border-gray-300 px-4 py-2">{post.author}</td>

                  {/* Post Image (Click to Open Modal) */}
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {post.media_path ? (
                      <img
                        src={`http://localhost:5000/uploads/${post.media_path}`}
                        alt={post.title}
                        className="w-14 h-14 rounded-md cursor-pointer hover:opacity-80"
                        onClick={() => openImageModal(post.media_path)}
                      />
                    ) : (
                      <span className="text-gray-500 text-xs">No Image</span>
                    )}
                  </td>

                  {/* Post Status */}
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <span className={`px-2 py-1 rounded-lg text-sm ${post.post_status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                      {post.post_status}
                    </span>
                  </td>

                  <td className="border border-gray-300 px-4 py-2">{formatDate(post.created_at)}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center flex gap-3">
                    {/* Updated Buttons with Dynamic Label */}
{/* Updated Buttons with Borders */}
{/* Updated Buttons with Confirmation */}
<button
  onClick={() => {
    if (window.confirm(`Are you sure you want to ${post.post_status === "active" ? "take down" : "activate"} this post?`)) {
      togglePostStatus(post.id, post.post_status);
    }
  }}
  className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 shadow-md border ${
    post.post_status === "active"
      ? "border-black text-black hover:bg-black hover:text-white"
      : "border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
  } transition`}
>
  {post.post_status === "active" ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
  {post.post_status === "active" ? "Take Down" : "Activate"}
</button>
<button
  onClick={() => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      deletePost(post.id);
    }
  }}
  className="ml-2 px-4 py-2 bg-transparent text-red-600 border border-red-600 rounded-lg flex items-center gap-2 shadow-md hover:bg-red-600 hover:text-white transition"
>
  <TrashIcon className="w-5 h-5" /> Delete
</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Image Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full relative">
              <button onClick={closeImageModal} className="absolute top-4 right-4 text-gray-600 hover:text-red-600 text-xl">
                <XMarkIcon className="w-6 h-6" />
              </button>
              <img src={`http://localhost:5000/uploads/${selectedImage}`} alt="Post Image" className="w-auto max-h-[80vh] rounded-md" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisplayPosts;