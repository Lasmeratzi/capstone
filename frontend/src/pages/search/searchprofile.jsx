import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; // Add useNavigate
import Sidebar from "../sidebar/sidebar";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { FaCheckCircle, FaUser, FaHashtag, FaMapMarkerAlt } from "react-icons/fa";

const VerifiedBadge = () => (
  <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 ml-1">
    <FaCheckCircle className="w-3 h-3 text-white" />
  </div>
);

// Result count badges
const ResultCount = ({ count, type }) => (
  <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
    {count}
  </span>
);

const SearchProfile = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState({ users: [], tags: [], locations: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [activeSection, setActiveSection] = useState("all");

  const navigate = useNavigate(); // Add navigate hook

  // Get logged in user's ID from JWT token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        setLoggedInUserId(decodedToken.id);
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    }
  }, []);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedTerm(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch universal search results
  const fetchResults = useCallback(async (term) => {
    if (!term.trim()) {
      setResults({ users: [], tags: [], locations: [] });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5000/api/search/universal?query=${encodeURIComponent(term)}`,
        { 
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000
        }
      );

      setResults(res.data.results || { users: [], tags: [], locations: [] });
    } catch (err) {
      console.error("Search error:", err);
      if (err.code === 'ECONNABORTED') {
        setError("Search request timed out. Please try again.");
      } else {
        setError(err.response?.data?.message || "Failed to fetch search results. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-search when debounced term changes
  useEffect(() => {
    if (debouncedTerm) {
      fetchResults(debouncedTerm);
    }
  }, [debouncedTerm, fetchResults]);

  // Manual button search
  const handleSearchClick = () => {
    if (!searchTerm.trim()) return;
    fetchResults(searchTerm);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchTerm("");
    setResults({ users: [], tags: [], locations: [] });
    setError(null);
    setActiveSection("all");
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  // Handle location click
  // In SearchProfile.jsx - update the handleLocationClick function
const handleLocationClick = (location) => {
  navigate(`/location/${location.id}`);
};

  // Filter out current user from results
  const filteredUsers = results.users.filter((user) => user.id !== loggedInUserId);

  // Result counts
  const resultCounts = {
    users: filteredUsers.length,
    tags: results.tags.length,
    locations: results.locations.length,
    total: filteredUsers.length + results.tags.length + results.locations.length
  };

  // Navigation tabs
  const sections = [
    { key: "all", name: "All", icon: null, count: resultCounts.total },
    { key: "users", name: "Artists", icon: <FaUser className="w-4 h-4" />, count: resultCounts.users },
    { key: "tags", name: "Tags", icon: <FaHashtag className="w-4 h-4" />, count: resultCounts.tags },
    { key: "locations", name: "Locations", icon: <FaMapMarkerAlt className="w-4 h-4" />, count: resultCounts.locations },
  ];

  // Check if we should show results
  const shouldShowResults = debouncedTerm && !loading && !error;
  const hasResults = resultCounts.total > 0;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="fixed h-screen w-60">
        <Sidebar />
      </div>

      <div className="ml-60 flex-grow py-6 px-8 md:px-20 lg:px-40">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Search</h2>
        <p className="text-gray-600 mb-6">Find artists, tags, and locations</p>

        {/* Search Bar */}
        <div className="flex items-center bg-white shadow-md rounded-lg px-4 py-3 mb-8 border border-gray-200">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 mr-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search users, tags, or locations... (Try 'T' for example)"
            className="w-full text-gray-700 focus:outline-none bg-transparent"
          />
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors mr-2"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
          <button
            onClick={handleSearchClick}
            disabled={loading || !searchTerm.trim()}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-all duration-300 disabled:cursor-not-allowed"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {/* Loading / Error */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Searching...</span>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
            <button
              onClick={handleSearchClick}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Results Navigation */}
        {shouldShowResults && hasResults && (
          <div className="mb-6 border-b border-gray-200">
            <nav className="flex space-x-1 overflow-x-auto">
              {sections.map((section) => (
                <button
                  key={section.key}
                  onClick={() => setActiveSection(section.key)}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors whitespace-nowrap ${
                    activeSection === section.key
                      ? "border-blue-600 text-blue-600 bg-blue-50"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {section.icon && <span className="mr-2">{section.icon}</span>}
                  {section.name}
                  {section.count > 0 && <ResultCount count={section.count} />}
                </button>
              ))}
            </nav>
          </div>
        )}

        {/* Results */}
        {shouldShowResults && (
          <div className="space-y-8">
            {/* ALL RESULTS */}
            {activeSection === "all" && (
              <>
                {/* USERS */}
                {resultCounts.users > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                      <FaUser className="mr-2 text-blue-600" />
                      Artists
                      <ResultCount count={resultCounts.users} />
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredUsers.map((user) => (
                        <div key={user.id} className="bg-white shadow-md rounded-lg p-5 hover:shadow-lg transition-all duration-300 border border-gray-100">
                          <div className="flex items-center mb-4">
                            <img
                              src={user.pfp 
                                ? `http://localhost:5000/uploads/${user.pfp}`
                                : "/default-avatar.png"
                              }
                              alt={`${user.username}'s profile`}
                              className="w-14 h-14 rounded-full object-cover border-2 border-gray-300"
                              onError={(e) => {
                                e.target.src = "/default-avatar.png";
                              }}
                            />
                            <div className="ml-4 flex-1">
                              <div className="flex items-center">
                                <p className="text-lg font-semibold text-gray-800 truncate">
                                  {user.username}
                                </p>
                                {user.verification_status === "approved" && <VerifiedBadge />}
                              </div>
                              <p className="text-sm text-gray-600 truncate">{user.fullname}</p>
                              {user.location_name && (
                                <p className="text-xs text-gray-500 truncate">
                                  {user.location_name}, {user.location_province}
                                </p>
                              )}
                            </div>
                          </div>
                          <Link
                            to={`/visitprofile/${user.id}`}
                            className="block w-full text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-all duration-300"
                          >
                            Visit Profile
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAGS */}
                {resultCounts.tags > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                      <FaHashtag className="mr-2 text-green-600" />
                      Tags
                      <ResultCount count={resultCounts.tags} />
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {results.tags.map((tag) => (
                        <Link
                          key={tag.id}
                          to={`/tags/${tag.name}`}
                          className="inline-flex items-center px-4 py-2 bg-green-50 border border-green-200 rounded-full text-green-800 hover:bg-green-100 hover:border-green-300 transition-all duration-300 cursor-pointer"
                        >
                          <FaHashtag className="w-3 h-3 mr-2" />
                          #{tag.name}
                          <span className="ml-2 text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">
                            {tag.post_count} posts
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* LOCATIONS */}
                {resultCounts.locations > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                      <FaMapMarkerAlt className="mr-2 text-red-600" />
                      Locations
                      <ResultCount count={resultCounts.locations} />
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {results.locations.map((loc) => (
  <Link
    key={loc.id}
    to={`/location/${loc.id}`}
    className="bg-white shadow rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all duration-300 hover:border-red-200 cursor-pointer block"
  >
    <div className="flex items-center mb-2">
      <FaMapMarkerAlt className="w-4 h-4 text-red-500 mr-2" />
      <p className="font-semibold text-gray-800">
        {loc.city}, {loc.province}
      </p>
    </div>
    <p className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded inline-block">
      {loc.artist_count} artist{loc.artist_count !== 1 ? 's' : ''}
    </p>
  </Link>
))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* USERS ONLY */}
            {activeSection === "users" && resultCounts.users > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="bg-white shadow-md rounded-lg p-5 hover:shadow-lg transition-all duration-300 border border-gray-100">
                    <div className="flex items-center mb-4">
                      <img
                        src={user.pfp 
                          ? `http://localhost:5000/uploads/${user.pfp}`
                          : "/default-avatar.png"
                        }
                        alt={`${user.username}'s profile`}
                        className="w-14 h-14 rounded-full object-cover border-2 border-gray-300"
                        onError={(e) => {
                          e.target.src = "/default-avatar.png";
                        }}
                      />
                      <div className="ml-4 flex-1">
                        <div className="flex items-center">
                          <p className="text-lg font-semibold text-gray-800 truncate">
                            {user.username}
                          </p>
                          {user.verification_status === "approved" && <VerifiedBadge />}
                        </div>
                        <p className="text-sm text-gray-600 truncate">{user.fullname}</p>
                        {user.location_name && (
                          <p className="text-xs text-gray-500 truncate">
                            {user.location_name}, {user.location_province}
                          </p>
                        )}
                      </div>
                    </div>
                    <Link
                      to={`/visitprofile/${user.id}`}
                      className="block w-full text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-all duration-300"
                    >
                      Visit Profile
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {/* TAGS ONLY */}
            {activeSection === "tags" && resultCounts.tags > 0 && (
              <div className="flex flex-wrap gap-3">
                {results.tags.map((tag) => (
                  <Link
                    key={tag.id}
                    to={`/tags/${tag.name}`}
                    className="inline-flex items-center px-4 py-3 bg-green-50 border border-green-200 rounded-full text-green-800 hover:bg-green-100 hover:border-green-300 transition-all duration-300 cursor-pointer text-lg"
                  >
                    <FaHashtag className="w-4 h-4 mr-2" />
                    #{tag.name}
                    <span className="ml-2 text-sm bg-green-200 text-green-800 px-2 py-1 rounded-full">
                      {tag.post_count} posts
                    </span>
                  </Link>
                ))}
              </div>
            )}

            {/* LOCATIONS ONLY */}
            {activeSection === "locations" && resultCounts.locations > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.locations.map((loc) => (
                  <div
                    key={loc.id}
                    className="bg-white shadow rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all duration-300 hover:border-red-200 cursor-pointer"
                    onClick={() => handleLocationClick(loc)}
                  >
                    <div className="flex items-center mb-2">
                      <FaMapMarkerAlt className="w-5 h-5 text-red-500 mr-2" />
                      <p className="font-semibold text-gray-800 text-lg">
                        {loc.city}, {loc.province}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                      {loc.artist_count} artist{loc.artist_count !== 1 ? 's' : ''} in this location
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* No Results */}
            {!hasResults && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <MagnifyingGlassIcon className="h-16 w-16 mx-auto" />
                </div>
                <p className="text-gray-500 text-lg mb-2">No results found for</p>
                <p className="text-gray-700 font-semibold text-xl">"{debouncedTerm}"</p>
                <p className="text-gray-500 mt-4">Try searching with different keywords</p>
              </div>
            )}
          </div>
        )}

        {/* Initial State */}
        {!debouncedTerm && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-300 mb-4">
              <MagnifyingGlassIcon className="h-20 w-20 mx-auto" />
            </div>
            <p className="text-gray-500 text-lg">Start typing to search for artists, tags, and locations</p>
            <p className="text-gray-400 mt-2">Try searching for "T" to see tags starting with T</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchProfile;