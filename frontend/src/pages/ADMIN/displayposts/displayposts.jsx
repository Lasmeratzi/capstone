import React, { useState, useEffect } from "react";
import axios from "axios";
import SideAdmin from "../sideadmin/sideadmin";
import { TrashIcon, EyeIcon, EyeSlashIcon, XMarkIcon } from "@heroicons/react/24/outline";

const DisplayPosts = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);

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
    return new Date(dateString).toLocaleDateString("en-US", { 
      month: "2-digit", 
      day: "2-digit", 
      year: "numeric" 
    });
  };

  // Toggle post status (Active ↔ Down)
  const togglePostStatus = (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "down" : "active";
    const token = localStorage.getItem("token");

    if (window.confirm(`Are you sure you want to ${newStatus === "active" ? "activate" : "take down"} this post?`)) {
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
    }
  };

  // Delete post
  const deletePost = (id) => {
    const token = localStorage.getItem("token");

    if (window.confirm("Are you sure you want to delete this post?")) {
      axios
        .delete(`http://localhost:5000/api/posts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          setPosts(posts.filter((post) => post.id !== id));
          alert("Post deleted successfully!");
        })
        .catch(() => alert("Failed to delete post."));
    }
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
  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
    setCurrentPage(1);
  };

  // Filter posts by title
  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm)
  );

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate stats
  const activePosts = posts.filter(p => p.post_status === 'active').length;
  const downPosts = posts.filter(p => p.post_status === 'down').length;

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Fixed Sidebar */}
      <div className="fixed h-full">
        <SideAdmin />
      </div>

      {/* Scrollable Content */}
      <div className="flex-grow p-6 ml-48">
        <h1 className="text-lg font-bold text-gray-800">Illura Database &gt; Posts</h1>
        <hr className="border-t border-gray-300 mt-2 mb-6" />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Posts</p>
                <p className="text-2xl font-bold text-gray-900">{posts.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Posts</p>
                <p className="text-2xl font-bold text-gray-900">{activePosts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center">
              <div className="bg-red-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Taken Down</p>
                <p className="text-2xl font-bold text-gray-900">{downPosts}</p>
              </div>
            </div>
          </div>

          {/* Search Card */}
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search Posts
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={handleSearch}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search by title..."
              />
              <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Posts Table */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">
                Posts Management ({filteredPosts.length} posts found)
              </h2>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Post Details</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Media</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 mb-1">{post.title}</div>
                        {post.description && (
                          <div className="text-sm text-gray-600 line-clamp-2">{post.description}</div>
                        )}
                        <div className="text-xs text-gray-400 mt-1">ID: {post.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{post.author}</div>
                    </td>
                    <td className="px-6 py-4">
                      {post.media_path ? (
                        <img
                          src={`http://localhost:5000/uploads/${post.media_path}`}
                          alt={post.title}
                          className="w-14 h-14 rounded-md cursor-pointer hover:opacity-80 transition-opacity object-cover"
                          onClick={() => openImageModal(post.media_path)}
                        />
                      ) : (
                        <span className="text-gray-400 text-sm">No media</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          post.post_status === "active"
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : "bg-red-100 text-red-800 border border-red-200"
                        }`}
                      >
                        {post.post_status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{formatDate(post.created_at)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => togglePostStatus(post.id, post.post_status)}
                          className={`inline-flex items-center px-4 py-2 rounded-lg font-semibold text-sm border transition-colors ${
                            post.post_status === "active"
                              ? "border-gray-700 text-gray-700 hover:bg-gray-700 hover:text-white"
                              : "border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                          }`}
                        >
                          {post.post_status === "active" ? (
                            <>
                              <EyeSlashIcon className="w-4 h-4 mr-2" />
                              Take Down
                            </>
                          ) : (
                            <>
                              <EyeIcon className="w-4 h-4 mr-2" />
                              Activate
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => deletePost(post.id)}
                          className="inline-flex items-center px-4 py-2 border border-red-600 text-red-600 rounded-lg font-semibold text-sm hover:bg-red-600 hover:text-white transition-colors"
                        >
                          <TrashIcon className="w-4 h-4 mr-2" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 0 && (
            <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Showing {indexOfFirstPost + 1} to {Math.min(indexOfLastPost, filteredPosts.length)} of {filteredPosts.length} results
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg border flex items-center gap-2 text-sm ${
                    currentPage === 1 
                      ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>
                
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg border flex items-center gap-2 text-sm ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                  }`}
                >
                  Next
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No posts found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? "Try adjusting your search term" : "No posts in the database"}
              </p>
            </div>
          )}
        </div>

        {/* Image Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full mx-4 relative">
              <button 
                onClick={closeImageModal} 
                className="absolute -top-3 -right-3 bg-white rounded-full p-1 shadow-lg hover:bg-gray-100 transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-600" />
              </button>
              <img 
                src={`http://localhost:5000/uploads/${selectedImage}`} 
                alt="Post" 
                className="w-full h-auto max-h-[80vh] object-contain rounded-md" 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisplayPosts;