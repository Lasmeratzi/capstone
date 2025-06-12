import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Sidebar from "../sidebar/sidebar";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { FaCheckCircle } from "react-icons/fa";

const VerifiedBadge = () => (
  <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 ml-1">
    <FaCheckCircle className="w-3 h-3 text-white" />
  </div>
);

const SearchProfile = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debouncedTerm, setDebouncedTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedTerm.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/search?query=${debouncedTerm}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setResults(response.data);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch search results.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedTerm]);

  const handleSearchClick = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/search?query=${searchTerm}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setResults(response.data);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch search results.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <div className="fixed h-screen w-60">
        <Sidebar />
      </div>

      <div className="ml-60 flex-grow py-6 px-40">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Search Profiles</h2>

        {/* Search Input and Button */}
        <div className="flex items-center bg-white shadow-md rounded-md px-4 py-3 mb-6">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 mr-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by username or fullname..."
            className="w-full text-gray-700 focus:outline-none"
          />
          <button
            onClick={handleSearchClick}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-all duration-300"
          >
            Search
          </button>
        </div>

        {/* Loading/Error Messages */}
        {loading && <p className="text-gray-500">Searching...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Search Results */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {results.length > 0 ? (
            results.map((user) => (
              <div key={user.id} className="bg-white shadow-md rounded-lg p-5 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center">
                  {/* Profile Picture */}
                  <img
                    src={`http://localhost:5000/uploads/${user.pfp}`}
                    alt={`${user.username}'s profile`}
                    className="w-14 h-14 rounded-full object-cover border-2 border-gray-300"
                  />
                  {/* User Info */}
                  <div className="ml-4">
                    <div className="flex items-center">
                      <p className="text-lg font-semibold text-gray-800">{user.username}</p>
                      {user.verification_request_status === "approved" && <VerifiedBadge />}
                    </div>
                    <p className="text-sm text-gray-600">{user.fullname}</p>
                    {/* Commission Status */}
                    <div className="flex items-center mt-1">
                      <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                        user.commissions === "open"
                          ? "bg-green-100 text-green-700 border border-green-400"
                          : "bg-gray-200 text-gray-600 border border-gray-400"
                      }`}>
                        {user.commissions === "open" ? "Open for Commissions" : "Closed for Commissions"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Visit Profile Button */}
                <Link
                  to={`/visitprofile/${user.id}`}
                  className="mt-4 block text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-all duration-300"
                >
                  Visit Profile
                </Link>
              </div>
            ))
          ) : (
            !loading && debouncedTerm && <p className="text-gray-500 text-center col-span-full">No profiles found matching "{debouncedTerm}"</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchProfile;