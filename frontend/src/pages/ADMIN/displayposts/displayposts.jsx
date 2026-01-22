import React, { useState, useEffect } from "react";
import axios from "axios";
import SideAdmin from "../sideadmin/sideadmin";
import { 
  TrashIcon, 
  EyeIcon, 
  EyeSlashIcon, 
  XMarkIcon, 
  FunnelIcon, 
  UserCircleIcon, 
  MagnifyingGlassIcon,
  PhotoIcon 
} from "@heroicons/react/24/outline";

const DisplayPosts = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filters, setFilters] = useState({
    userId: "",
    status: "all",
    search: ""
  });
  const [stats, setStats] = useState({ total: 0, active: 0, down: 0 });
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [userSearch, setUserSearch] = useState("");

  // Fetch posts and users when component loads or filters change
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token = sessionStorage.getItem("adminToken");
      
      try {
        // Fetch posts with filters
        const params = new URLSearchParams();
        if (filters.userId) params.append('userId', filters.userId);
        if (filters.status !== 'all') params.append('status', filters.status);
        if (filters.search) params.append('search', filters.search);
        
        const postsResponse = await axios.get(
          `http://localhost:5000/api/admin/posts?${params.toString()}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setPosts(postsResponse.data.posts || []);
        setStats(postsResponse.data.stats || { total: 0, active: 0, down: 0 });
        
        // Fetch users for dropdown
        const usersResponse = await axios.get(
          "http://localhost:5000/api/admin/posts/users",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setUsers(usersResponse.data || []);
        setFilteredUsers(usersResponse.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to fetch posts.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [filters]);

  // Filter users based on search input
  useEffect(() => {
    if (userSearch.trim() === "") {
      setFilteredUsers(users);
    } else {
      const searchLower = userSearch.toLowerCase();
      const filtered = users.filter(user => 
        user.username.toLowerCase().includes(searchLower) ||
        user.fullname.toLowerCase().includes(searchLower) ||
        user.id.toString().includes(searchLower)
      );
      setFilteredUsers(filtered);
    }
  }, [userSearch, users]);

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", { 
      month: "2-digit", 
      day: "2-digit", 
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Get selected user display
  const getSelectedUser = () => {
    if (!filters.userId) return null;
    return users.find(user => user.id.toString() === filters.userId);
  };

  // Clear user filter
  const clearUserFilter = () => {
    setFilters(prev => ({ ...prev, userId: "" }));
    setUserSearch("");
  };

  // Toggle post status (Active ↔ Down)
  const togglePostStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "down" : "active";
    const token = sessionStorage.getItem("adminToken");

    if (window.confirm(`Are you sure you want to ${newStatus === "active" ? "activate" : "take down"} this post?`)) {
      try {
        await axios.patch(
          `http://localhost:5000/api/admin/posts/${id}/status`,
          { status: newStatus },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setPosts(posts.map((post) =>
          post.id === id ? { ...post, post_status: newStatus } : post
        ));
        
        // Update stats
        setStats(prev => ({
          ...prev,
          active: newStatus === 'active' ? prev.active + 1 : prev.active - 1,
          down: newStatus === 'down' ? prev.down + 1 : prev.down - 1
        }));
        
        alert(`Post status changed to ${newStatus}!`);
      } catch (error) {
        alert("Failed to update post status.");
      }
    }
  };

  // Delete post
  const deletePost = async (id) => {
    const token = sessionStorage.getItem("adminToken");

    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/posts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const postToDelete = posts.find(p => p.id === id);
        setPosts(posts.filter((post) => post.id !== id));
        
        // Update stats
        setStats(prev => ({
          total: prev.total - 1,
          active: postToDelete.post_status === 'active' ? prev.active - 1 : prev.active,
          down: postToDelete.post_status === 'down' ? prev.down - 1 : prev.down
        }));
        
        alert("Post deleted successfully!");
      } catch (error) {
        alert("Failed to delete post.");
      }
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

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      userId: "",
      status: "all",
      search: ""
    });
    setUserSearch("");
  };

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Posts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
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
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
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
                <p className="text-2xl font-bold text-gray-900">{stats.down}</p>
              </div>
            </div>
          </div>

          {/* Filter Toggle Card */}
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <FunnelIcon className="w-5 h-5" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
          </div>

          {/* Reset Filters Card */}
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <button
              onClick={resetFilters}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              disabled={!filters.userId && filters.status === 'all' && !filters.search}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset Filters
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter Posts</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* User Filter with Searchable Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <UserCircleIcon className="w-4 h-4 inline mr-1" />
                  Filter by User
                </label>
                <div className="relative">
                  <div className="relative">
                    <input
                      type="text"
                      value={userSearch}
                      onChange={(e) => {
                        setUserSearch(e.target.value);
                        setShowUserDropdown(true);
                      }}
                      onFocus={() => setShowUserDropdown(true)}
                      placeholder="Search user by name, username, or ID..."
                      className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <UserCircleIcon className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    
                    {/* Selected User Display */}
                    {filters.userId && (
                      <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                        <div className="flex items-center bg-blue-50 rounded-full px-3 py-1">
                          {getSelectedUser()?.pfp ? (
                            <img 
                              src={`http://localhost:5000/uploads/${getSelectedUser().pfp}`} 
                              alt="User" 
                              className="w-6 h-6 rounded-full mr-2"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                              <span className="text-xs font-bold text-blue-600">
                                {getSelectedUser()?.username?.[0]?.toUpperCase() || 'U'}
                              </span>
                            </div>
                          )}
                          <span className="text-sm font-medium text-blue-700">
                            {getSelectedUser()?.username}
                          </span>
                          <button
                            onClick={clearUserFilter}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* User Dropdown */}
                  {showUserDropdown && filteredUsers.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredUsers.map(user => (
                        <button
                          key={user.id}
                          type="button"
                          onClick={() => {
                            handleFilterChange("userId", user.id.toString());
                            setUserSearch("");
                            setShowUserDropdown(false);
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 last:border-b-0"
                        >
                          {user.pfp ? (
                            <img 
                              src={`http://localhost:5000/uploads/${user.pfp}`} 
                              alt={user.username} 
                              className="w-8 h-8 rounded-full"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-sm font-bold text-blue-600">
                                {user.username?.[0]?.toUpperCase() || 'U'}
                              </span>
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">@{user.username}</div>
                            <div className="text-sm text-gray-600">{user.fullname}</div>
                          </div>
                          <div className="text-xs text-gray-400">ID: {user.id}</div>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Clear button */}
                  {filters.userId && (
                    <button
                      onClick={clearUserFilter}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Status
                </label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleFilterChange("status", "all")}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                      filters.status === "all"
                        ? "bg-gray-800 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => handleFilterChange("status", "active")}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                      filters.status === "active"
                        ? "bg-green-600 text-white"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => handleFilterChange("status", "down")}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                      filters.status === "down"
                        ? "bg-red-600 text-white"
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                    }`}
                  >
                    Taken Down
                  </button>
                </div>
              </div>

              {/* Search Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MagnifyingGlassIcon className="w-4 h-4 inline mr-1" />
                  Search Posts
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange("search", e.target.value)}
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search post title or content..."
                  />
                  <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  {filters.search && (
                    <button
                      onClick={() => handleFilterChange("search", "")}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Posts Table */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">
                Posts Management ({posts.length} posts found)
                {filters.userId && (
                  <span className="ml-2 text-sm font-normal text-blue-600">
                    • User: {getSelectedUser()?.username || `ID: ${filters.userId}`}
                  </span>
                )}
                {filters.status !== 'all' && (
                  <span className={`ml-2 text-sm font-normal ${filters.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                    • Status: {filters.status}
                  </span>
                )}
                {filters.search && (
                  <span className="ml-2 text-sm font-normal text-gray-600">
                    • Search: "{filters.search}"
                  </span>
                )}
              </h2>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading posts...</p>
            </div>
          ) : (
            <>
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
                            <div className="text-xs text-gray-500 mt-1">
                              Visibility: 
                              <span className={`ml-1 px-2 py-0.5 rounded ${
                                post.visibility === 'public' ? 'bg-blue-100 text-blue-800' :
                                post.visibility === 'friends' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {post.visibility}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {post.author_pfp ? (
                              <img 
                                src={`http://localhost:5000/uploads/${post.author_pfp}`} 
                                alt={post.author} 
                                className="w-10 h-10 rounded-full border-2 border-gray-300"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-gray-300 flex items-center justify-center">
                                <span className="text-sm font-bold text-blue-600">
                                  {post.author?.[0]?.toUpperCase() || 'U'}
                                </span>
                              </div>
                            )}
                            <div>
                              <div className="text-sm font-semibold text-gray-900">@{post.author}</div>
                              <div className="text-xs text-gray-600">{post.fullname}</div>
                              <div className="text-xs text-gray-400">ID: {post.author_id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
  {post.media_path ? (
    <img
      src={`http://localhost:5000/uploads/${post.media_path}`}
      alt={post.title}
      className="w-14 h-14 rounded-md cursor-pointer hover:opacity-80 transition-all duration-200 object-cover hover:scale-105"
      onClick={() => openImageModal(post.media_path)}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = "https://via.placeholder.com/56x56?text=No+Image";
      }}
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
                          {post.updated_at !== post.created_at && (
                            <div className="text-xs text-gray-500">Updated: {formatDate(post.updated_at)}</div>
                          )}
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
                    Showing {indexOfFirstPost + 1} to {Math.min(indexOfLastPost, posts.length)} of {posts.length} results
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
                    
                    {/* Page Numbers */}
                    <div className="flex space-x-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => paginate(pageNum)}
                            className={`px-3 py-2 rounded-lg border text-sm ${
                              currentPage === pageNum
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    
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

              {posts.length === 0 && (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No posts found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {filters.userId || filters.status !== 'all' || filters.search 
                      ? "Try adjusting your filters" 
                      : "No posts in the database"}
                  </p>
                </div>
              )}
            </>
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