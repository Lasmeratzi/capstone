// src/pages/search/PortfolioPostsPage.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Search,
  User,
  Calendar,
  Image as ImageIcon,
  Tag,
  Filter,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Sidebar from "../sidebar/sidebar";

const API_BASE = "http://localhost:5000";

const PortfolioPostsPage = () => {
  const [portfolioResults, setPortfolioResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all"); // all, recent, popular
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get("query") || "";
    setSearchQuery(query);
    
    if (query) {
      searchPortfolio(query);
    } else {
      setLoading(false);
    }
  }, [location, filter]);

  const searchPortfolio = async (query) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      // Build URL with filter
      let url = `http://localhost:5000/api/search/portfolio?query=${encodeURIComponent(query)}`;
      
      // Add filter params if needed
      if (filter === "recent") {
        url += "&sort=recent";
      } else if (filter === "popular") {
        url += "&sort=popular";
      }
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setPortfolioResults(response.data.results || []);
    } catch (error) {
      console.error("Error searching portfolio:", error);
      setPortfolioResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search/portfolio?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handlePortfolioClick = (portfolioId, userId) => {
  navigate(`/visitprofile/${userId}?tab=portfolio`);
};

  const handleUserClick = (userId) => {
    navigate(`/visitprofile/${userId}`);
  };

  const getMediaUrl = (image_path) => {
    const cleanPath = image_path.startsWith("uploads/")
      ? image_path.slice("uploads/".length)
      : image_path;
    return `${API_BASE}/uploads/${cleanPath}`;
  };

  const ProtectedMedia = ({ image_path, title, className = "" }) => {
    const handleContextMenu = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDragStart = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const mediaUrl = getMediaUrl(image_path);

    return (
      <div
        className={`relative ${className}`}
        onContextMenu={handleContextMenu}
        onDragStart={handleDragStart}
        style={{
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
        }}
      >
        <img
          src={mediaUrl}
          alt={title}
          className="w-full h-full object-cover pointer-events-none"
          loading="lazy"
          onContextMenu={handleContextMenu}
          onDragStart={handleDragStart}
          draggable={false}
        />
        <div 
          className="absolute inset-0 cursor-pointer"
          style={{ pointerEvents: 'auto' }}
          onContextMenu={handleContextMenu}
          onDragStart={handleDragStart}
        />
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="fixed h-screen w-60">
        <Sidebar />
      </div>

      <div className="ml-60 flex-grow py-6 px-4 md:px-8 lg:px-16">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Portfolio Search</h1>
        </div>

        {/* Search Bar */}
        <div className="max-w-4xl mx-auto mb-6">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={20} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search portfolio items by title or description..."
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 px-4 text-sm font-medium text-white bg-blue-600 rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Search
              </button>
            </div>
          </form>

          {/* Filter Options */}
          {searchQuery && (
            <div className="flex items-center gap-2 mt-3">
              <Filter size={16} className="text-gray-500" />
              <span className="text-sm text-gray-600">Filter:</span>
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1 text-sm rounded-full ${filter === "all" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("recent")}
                className={`px-3 py-1 text-sm rounded-full ${filter === "recent" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                Recent
              </button>
              <button
                onClick={() => setFilter("popular")}
                className={`px-3 py-1 text-sm rounded-full ${filter === "popular" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                Popular
              </button>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : portfolioResults.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <ImageIcon size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery ? "No portfolio items found" : "Search Portfolio Items"}
              </h3>
              <p className="text-gray-500">
                {searchQuery 
                  ? `No portfolio items matching "${searchQuery}"`
                  : "Enter a search term to find portfolio items by title or description"
                }
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {portfolioResults.length} portfolio item{portfolioResults.length !== 1 ? 's' : ''} found for "{searchQuery}"
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Showing results sorted by {filter === "recent" ? "most recent" : filter === "popular" ? "most popular" : "relevance"}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolioResults.map((item, index) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-blue-300 group"
                  >
                    {/* Portfolio Image */}
                    <div 
                      className="relative h-48 overflow-hidden bg-gray-100 cursor-pointer"
                      onClick={() => handlePortfolioClick(item.id, item.user_id)}
                    >
                      <ProtectedMedia
                        image_path={item.image_path}
                        title={item.title}
                        className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Portfolio Content */}
                    <div className="p-4">
                      <h3 
                        className="font-semibold text-gray-900 text-lg mb-2 line-clamp-1 cursor-pointer hover:text-blue-600"
                        onClick={() => handlePortfolioClick(item.id, item.user_id)}
                      >
                        {item.title}
                      </h3>
                      
                      {item.description && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {item.description}
                        </p>
                      )}

                      {/* Author Info */}
                      <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                        <div 
                          className="flex items-center space-x-2 cursor-pointer hover:opacity-80"
                          onClick={() => handleUserClick(item.user_id)}
                        >
                          {item.pfp ? (
                            <img
                              src={`${API_BASE}/uploads/${item.pfp}`}
                              alt={item.fullname}
                              className="w-8 h-8 rounded-full object-cover border border-gray-200"
                              onError={(e) => {
                                e.target.src = "/default-avatar.png";
                              }}
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                              <User size={16} className="text-gray-600" />
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {item.fullname || item.username}
                            </p>
                            <p className="text-xs text-gray-500">
                              @{item.username}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar size={12} className="mr-1" />
                          {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Button (if you implement pagination) */}
              {portfolioResults.length >= 10 && (
                <div className="text-center mt-8">
                  <button
                    onClick={() => {
                      // Implement load more functionality
                      console.log("Load more clicked");
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioPostsPage;