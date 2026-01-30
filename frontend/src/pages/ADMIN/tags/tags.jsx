import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import SideAdmin from "../sideadmin/sideadmin";
import { 
  Search, 
  Filter, 
  TrendingUp, 
  Hash, 
  BarChart3, 
  Edit, 
  Trash2, 
  RefreshCw,
  X,
  AlertTriangle,
  CheckCircle,
  Tag,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const Tags = () => {
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [loading, setLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState(new Set());
  const [showUnusedOnly, setShowUnusedOnly] = useState(false);
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [authError, setAuthError] = useState(false);

  // Get token - handles multiple storage locations
  const getToken = () => {
    const token = localStorage.getItem("token") || 
                  localStorage.getItem("adminToken") ||
                  sessionStorage.getItem("token") ||
                  "";
    
    if (!token) {
      setAuthError(true);
      setMessage({ 
        text: "Authentication required. Please log in again.", 
        type: "error" 
      });
    }
    
    return token;
  };

  // Fetch ALL tags including unused ones
  const fetchTags = async () => {
    try {
      setLoading(true);
      const token = getToken();
      
      if (!token) {
        setMessage({ 
          text: "Authentication token not found. Please log in.", 
          type: "error" 
        });
        setLoading(false);
        return;
      }

      // Use the existing endpoints that work
      const popularResponse = await axios.get("http://localhost:5000/api/tags/popular", {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        params: { limit: 200 }
      });
      
      // Since we only have popular tags, we'll use what we get
      setTags(popularResponse.data || []);
      setAuthError(false);
      setMessage({ text: "", type: "" });
      setCurrentPage(1);
    } catch (error) {
      console.error("Failed to fetch tags:", error);
      
      if (error.response?.status === 401) {
        setAuthError(true);
        setMessage({ 
          text: "Session expired. Please log in again.", 
          type: "error" 
        });
      } else if (error.response?.status === 403) {
        setMessage({ 
          text: "Access denied. Admin privileges required.", 
          type: "error" 
        });
      } else {
        setMessage({ 
          text: "Failed to load tags. Please try again.", 
          type: "error" 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Search tags
  const searchTags = async (query) => {
    if (!query || query.length < 1) {
      fetchTags();
      return;
    }
    
    try {
      setLoading(true);
      const token = getToken();
      
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axios.get("http://localhost:5000/api/tags/search", {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        params: { query }
      });
      setTags(response.data || []);
      setCurrentPage(1);
    } catch (error) {
      console.error("Failed to search tags:", error);
      
      if (error.response?.status === 401) {
        setAuthError(true);
        setMessage({ 
          text: "Session expired. Please log in again.", 
          type: "error" 
        });
      } else {
        setMessage({ 
          text: "Failed to search tags.", 
          type: "error" 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim() !== "") {
        searchTags(searchTerm);
      } else {
        fetchTags();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = tags.length;
    const active = tags.filter(tag => (tag.usage_count || 0) > 0).length;
    const trending = tags.filter(tag => (tag.usage_count || 0) > 10).length;
    const unused = tags.filter(tag => (tag.usage_count || 0) === 0).length;
    
    return { total, active, trending, unused };
  }, [tags]);

  // Filter and sort tags
  const filteredAndSortedTags = useMemo(() => {
    let filtered = tags;
    
    if (searchTerm) {
      filtered = filtered.filter(tag => 
        tag.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (showUnusedOnly) {
      filtered = filtered.filter(tag => (tag.usage_count || 0) === 0);
    }
    
    const sorted = [...filtered];
    const direction = sortDirection === "asc" ? 1 : -1;
    
    switch (sortBy) {
      case "name":
        return sorted.sort((a, b) => 
          direction * a.name.localeCompare(b.name)
        );
      case "usage":
        return sorted.sort((a, b) => 
          direction * ((a.usage_count || 0) - (b.usage_count || 0))
        );
      case "popular":
      default:
        return sorted.sort((a, b) => 
          -direction * ((b.usage_count || 0) - (a.usage_count || 0))
        );
    }
  }, [tags, searchTerm, showUnusedOnly, sortBy, sortDirection]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredAndSortedTags.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTags = filteredAndSortedTags.slice(startIndex, endIndex);

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  // Handle tag selection
  const toggleTagSelection = (tagId) => {
    const newSelected = new Set(selectedTags);
    if (newSelected.has(tagId)) {
      newSelected.delete(tagId);
    } else {
      newSelected.add(tagId);
    }
    setSelectedTags(newSelected);
  };

  // Select all paginated tags
  const selectAllPaginatedTags = () => {
    const paginatedIds = paginatedTags.map(tag => tag.id);
    const allSelected = paginatedIds.every(id => selectedTags.has(id));
    
    const newSelected = new Set(selectedTags);
    if (allSelected) {
      paginatedIds.forEach(id => newSelected.delete(id));
    } else {
      paginatedIds.forEach(id => newSelected.add(id));
    }
    setSelectedTags(newSelected);
  };

  // Bulk delete selected tags - LOCAL ONLY VERSION
  const handleBulkDelete = async () => {
    if (selectedTags.size === 0) {
      setMessage({ 
        text: "No tags selected for deletion.", 
        type: "warning" 
      });
      return;
    }

    const tagsInUse = tags.filter(tag => 
      selectedTags.has(tag.id) && (tag.usage_count || 0) > 0
    );
    
    if (tagsInUse.length > 0) {
      setMessage({ 
        text: `Cannot delete ${tagsInUse.length} tag(s) that are in use.`, 
        type: "error" 
      });
      return;
    }

    if (!window.confirm(`Delete ${selectedTags.size} selected tag(s)? This action cannot be undone.`)) {
      return;
    }

    // Local deletion only since backend endpoint doesn't exist
    const newTags = tags.filter(tag => !selectedTags.has(tag.id));
    setTags(newTags);
    setSelectedTags(new Set());
    setMessage({ 
      text: `${selectedTags.size} tag(s) removed from list.`, 
      type: "success" 
    });
  };

  // Cleanup unused tags
  const handleCleanup = async () => {
    const unusedCount = stats.unused;
    if (unusedCount === 0) {
      setMessage({ 
        text: "No unused tags to clean up.", 
        type: "info" 
      });
      return;
    }

    if (!window.confirm(`Clean up ${unusedCount} unused tags? This will permanently delete tags with 0 usage.`)) {
      return;
    }

    try {
      const token = getToken();
      const response = await axios.delete("http://localhost:5000/api/tags/cleanup", {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      setMessage({ 
        text: response.data.message || "Unused tags cleaned up successfully!", 
        type: "success" 
      });
      fetchTags();
    } catch (error) {
      console.error("Failed to cleanup tags:", error);
      if (error.response?.status === 401) {
        setAuthError(true);
        setMessage({ 
          text: "Session expired. Please log in again.", 
          type: "error" 
        });
      } else {
        setMessage({ 
          text: "Failed to cleanup unused tags.", 
          type: "error" 
        });
      }
    }
  };

  // Update tag - LOCAL ONLY VERSION
  const handleUpdate = (tag) => {
    setCurrentTag(tag);
    setShowModal(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!currentTag?.name?.trim()) {
      setMessage({ 
        text: "Tag name is required.", 
        type: "warning" 
      });
      return;
    }

    // Local update only since backend endpoint doesn't exist
    const updatedTags = tags.map(tag => 
      tag.id === currentTag.id ? { ...tag, name: currentTag.name.toLowerCase().trim() } : tag
    );
    setTags(updatedTags);
    setShowModal(false);
    setMessage({ 
      text: "Tag name updated locally.", 
      type: "success" 
    });
  };

  // Pagination controls
  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }
    
    return pageNumbers;
  };

  // Login redirect
  const handleLoginRedirect = () => {
    window.location.href = "/login";
  };

  useEffect(() => {
    fetchTags();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Fixed Sidebar - Same as homeadmin.jsx */}
      <div className="fixed left-0 top-0 h-full z-10">
        <SideAdmin />
      </div>

      {/* Main Content with proper margin for fixed sidebar */}
      <div className="flex-grow ml-48">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Illura Database &gt; Tags</h1>
                <p className="text-sm text-gray-500 mt-0.5">Manage and monitor content tags</p>
              </div>
              <button
                onClick={fetchTags}
                className="flex items-center px-3 py-2 text-sm text-gray-600 bg-white rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                Refresh
              </button>
            </div>
          </div>

          {/* Authentication Error Banner */}
          {authError && (
            <div className="mb-4 rounded-lg p-3 bg-red-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />
                  <span className="text-sm text-red-700">
                    Authentication required. Please log in to access tags.
                  </span>
                </div>
                <button
                  onClick={handleLoginRedirect}
                  className="px-3 py-1 text-xs font-medium text-white bg-red-500 rounded hover:bg-red-600"
                >
                  Log In
                </button>
              </div>
            </div>
          )}

          {/* Stats Cards - Clean, borderless design */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Hash className="w-4 h-4 text-blue-500" />
                </div>
                <div className="ml-3">
                  <p className="text-xs text-gray-500">Total Tags</p>
                  <p className="text-base font-semibold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center">
                <div className="p-2 bg-green-50 rounded-lg">
                  <BarChart3 className="w-4 h-4 text-green-500" />
                </div>
                <div className="ml-3">
                  <p className="text-xs text-gray-500">Active</p>
                  <p className="text-base font-semibold text-gray-900">{stats.active}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-purple-500" />
                </div>
                <div className="ml-3">
                  <p className="text-xs text-gray-500">Trending</p>
                  <p className="text-base font-semibold text-gray-900">{stats.trending}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <Tag className="w-4 h-4 text-gray-500" />
                </div>
                <div className="ml-3">
                  <p className="text-xs text-gray-500">Unused</p>
                  <div className="flex items-center justify-between">
                    <p className="text-base font-semibold text-gray-900">{stats.unused}</p>
                    {stats.unused > 0 && !authError && (
                      <button
                        onClick={handleCleanup}
                        className="text-xs text-red-500 hover:text-red-600 font-medium ml-2"
                      >
                        Clean up
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Message Alert */}
          {message.text && (
            <div className={`mb-4 rounded-lg p-3 ${
              message.type === "success" 
                ? "bg-green-50"
                : message.type === "error"
                ? "bg-red-50"
                : message.type === "warning"
                ? "bg-yellow-50"
                : "bg-blue-50"
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {message.type === "success" ? (
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  ) : (
                    <AlertTriangle className={`w-4 h-4 mr-2 ${
                      message.type === "error" ? "text-red-500" : 
                      message.type === "warning" ? "text-yellow-500" : 
                      "text-blue-500"
                    }`} />
                  )}
                  <span className={`text-sm ${
                    message.type === "success" ? "text-green-700" : 
                    message.type === "error" ? "text-red-700" : 
                    message.type === "warning" ? "text-yellow-700" : 
                    "text-blue-700"
                  }`}>
                    {message.text}
                  </span>
                </div>
                <button
                  onClick={() => setMessage({ text: "", type: "" })}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Toolbar - Clean design */}
          <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search tags..."
                    className="pl-10 pr-4 py-2 text-sm bg-gray-50 rounded-lg focus:bg-white focus:ring-1 focus:ring-blue-500 w-64"
                    disabled={authError}
                  />
                </div>

                <div className="flex items-center">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-sm bg-gray-50 rounded-lg px-3 py-2 focus:ring-1 focus:ring-blue-500"
                    disabled={authError}
                  >
                    <option value="popular">Popularity</option>
                    <option value="usage">Usage Count</option>
                    <option value="name">Name</option>
                  </select>
                  <button
                    onClick={toggleSortDirection}
                    className="ml-2 p-1.5 text-gray-400 hover:text-gray-600 bg-gray-50 rounded-lg"
                    disabled={authError}
                  >
                    {sortDirection === "asc" ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowUnusedOnly(!showUnusedOnly)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg ${
                    showUnusedOnly
                      ? "bg-red-50 text-red-600"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                  disabled={authError}
                >
                  {showUnusedOnly ? "Show All" : "Show Unused"}
                </button>

                {selectedTags.size > 0 && !authError && (
                  <button
                    onClick={handleBulkDelete}
                    className="flex items-center px-3 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-1.5" />
                    Delete ({selectedTags.size})
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Tags Table - Clean borderless design */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p className="mt-3 text-sm text-gray-600">Loading tags...</p>
              </div>
            ) : authError ? (
              <div className="text-center py-12">
                <div className="mx-auto w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-3">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-base font-medium text-gray-900 mb-1">Authentication Required</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Please log in to view and manage tags
                </p>
                <button
                  onClick={handleLoginRedirect}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                >
                  Go to Login
                </button>
              </div>
            ) : filteredAndSortedTags.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <Tag className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-base font-medium text-gray-900 mb-1">No tags found</h3>
                <p className="text-sm text-gray-600">
                  {searchTerm 
                    ? `No tags matching "${searchTerm}"`
                    : showUnusedOnly
                    ? "No unused tags found"
                    : "No tags available"}
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="w-10 pl-6 pr-3 py-3">
                          <input
                            type="checkbox"
                            checked={paginatedTags.length > 0 && paginatedTags.every(tag => selectedTags.has(tag.id))}
                            onChange={selectAllPaginatedTags}
                            className="rounded text-blue-500 focus:ring-blue-500"
                            disabled={authError}
                          />
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tag
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Usage
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {paginatedTags.map((tag) => {
                        const usageCount = tag.usage_count || 0;
                        const isSelected = selectedTags.has(tag.id);
                        
                        return (
                          <tr 
                            key={tag.id} 
                            className={`hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}
                          >
                            <td className="pl-6 pr-3 py-3">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleTagSelection(tag.id)}
                                className="rounded text-blue-500 focus:ring-blue-500"
                                disabled={authError}
                              />
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center">
                                <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-blue-50 text-blue-600">
                                  #{tag.name}
                                </span>
                                <span className="ml-2 text-xs text-gray-500">ID: {tag.id}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center">
                                <div className="w-20">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium text-gray-900">
                                      {usageCount}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {Math.min(100, usageCount * 5)}%
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div 
                                      className={`h-1.5 rounded-full ${
                                        usageCount > 20 
                                          ? "bg-purple-500" 
                                          : usageCount > 5
                                          ? "bg-green-500"
                                          : usageCount > 0
                                          ? "bg-blue-500"
                                          : "bg-gray-400"
                                      }`}
                                      style={{ width: `${Math.min(100, usageCount * 5)}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                usageCount === 0
                                  ? "bg-gray-100 text-gray-700"
                                  : usageCount > 10
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-green-100 text-green-700"
                              }`}>
                                {usageCount === 0
                                  ? "Unused"
                                  : usageCount > 10
                                  ? "Trending"
                                  : "Active"}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center space-x-1">
                                <button
                                  onClick={() => handleUpdate(tag)}
                                  className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                                  title="Edit tag"
                                  disabled={authError}
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (window.confirm(`Delete tag "#${tag.name}"?`)) {
                                      const newTags = tags.filter(t => t.id !== tag.id);
                                      setTags(newTags);
                                    }
                                  }}
                                  disabled={authError || usageCount > 0}
                                  className={`p-1.5 rounded ${
                                    authError || usageCount > 0
                                      ? "text-gray-300 cursor-not-allowed"
                                      : "text-gray-500 hover:text-red-600 hover:bg-red-50"
                                  }`}
                                  title={authError ? "Authentication required" : usageCount > 0 ? "Tag is in use" : "Delete tag"}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination - Clean design */}
                {totalPages > 1 && !authError && (
                  <div className="px-6 py-4 bg-gray-50">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="text-sm text-gray-600 mb-3 sm:mb-0">
                        Showing{" "}
                        <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                        <span className="font-medium">
                          {Math.min(currentPage * itemsPerPage, filteredAndSortedTags.length)}
                        </span> of{" "}
                        <span className="font-medium">{filteredAndSortedTags.length}</span> tags
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={prevPage}
                          disabled={currentPage === 1}
                          className={`p-2 rounded ${
                            currentPage === 1
                              ? "text-gray-300 cursor-not-allowed"
                              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                          }`}
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        
                        {getPageNumbers().map((page) => (
                          <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`px-3 py-1 text-sm rounded ${
                              currentPage === page
                                ? "bg-blue-500 text-white"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                        
                        {totalPages > 5 && currentPage < totalPages - 2 && (
                          <span className="px-2 text-gray-400">...</span>
                        )}
                        
                        <button
                          onClick={nextPage}
                          disabled={currentPage === totalPages}
                          className={`p-2 rounded ${
                            currentPage === totalPages
                              ? "text-gray-300 cursor-not-allowed"
                              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                          }`}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Summary info */}
          {filteredAndSortedTags.length > 0 && !authError && (
            <div className="mt-3 text-xs text-gray-500 text-center">
              {selectedTags.size > 0 ? (
                <span className="text-blue-600 font-medium">{selectedTags.size} tags selected</span>
              ) : (
                <span>{filteredAndSortedTags.length} tags • Page {currentPage} of {totalPages}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal - Clean design */}
      {showModal && currentTag && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm">
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Edit Tag</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleUpdateSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tag Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">#</span>
                      </div>
                      <input
                        type="text"
                        value={currentTag.name || ""}
                        onChange={(e) =>
                          setCurrentTag({ ...currentTag, name: e.target.value })
                        }
                        className="pl-8 w-full px-3 py-2 text-sm bg-gray-50 rounded-lg focus:bg-white focus:ring-1 focus:ring-blue-500"
                        placeholder="tag-name"
                        required
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Will be saved as lowercase</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-xs font-medium text-gray-700 mb-3">Tag Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 mb-1">ID</p>
                        <p className="font-medium text-gray-900">{currentTag.id}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Usage</p>
                        <p className="font-medium text-gray-900">{currentTag.usage_count || 0} posts</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tags;