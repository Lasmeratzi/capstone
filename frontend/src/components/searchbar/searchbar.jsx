import React, { useState } from "react";

const SearchBar = ({ isOpen, closeSearchBar }) => {
  const [searchQuery, setSearchQuery] = useState(""); // Input for the search
  const [results, setResults] = useState([]); // Store search results
  const [errorMessage, setErrorMessage] = useState(""); // Handle errors

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setErrorMessage("Please enter a search query.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/profiles/search?query=${searchQuery}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          setResults([]);
          setErrorMessage("No accounts found.");
        } else {
          throw new Error("Failed to fetch results.");
        }
        return;
      }

      const data = await response.json();
      console.log("API Response:", data); // Debug response
      setResults(data);
      setErrorMessage(""); // Clear previous errors
    } catch (error) {
      console.error("Error fetching accounts:", error);
      setErrorMessage("An error occurred while searching. Please try again.");
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 text-white shadow-lg transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300`}
      style={{ backgroundColor: "#00040d" }}
    >
      {/* Close Button */}
      <button
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 text-xl"
        onClick={closeSearchBar}
      >
        &times;
      </button>

      {/* Search Input */}
      <div className="mt-16 px-4">
        <h2 className="text-lg font-bold mb-4">Search Accounts</h2>
        <input
          type="text"
          placeholder="Search by fullname, username, or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring focus:ring-[#5E66FF]"
        />
        <button
          onClick={handleSearch}
          className="mt-4 px-3 py-2 bg-[#5E66FF] rounded text-white hover:bg-[#4D5BFF] focus:outline-none"
        >
          Search
        </button>
      </div>

      {/* Display Error Messages */}
      {errorMessage && (
        <p className="mt-4 px-4 text-red-400 text-sm">{errorMessage}</p>
      )}

      {/* Display Results Below the Search Bar */}
      <div className="mt-4 px-4 max-h-64 overflow-y-auto">
        {results.length > 0 ? (
          <ul>
            {results.map((account, index) => (
              <li
                key={index}
                className="flex items-center py-2 border-b border-gray-700 text-sm"
              >
                <img
                  src={account.pfp || "/default-avatar.png"} // Use default avatar if none exists
                  alt={`${account.username}'s avatar`}
                  className="w-8 h-8 rounded-full mr-3"
                />
                <div>
                  <strong>{account.username}</strong> ({account.fullname})
                  <p className="text-gray-400 text-xs">{account.email}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          searchQuery &&
          !errorMessage && <p className="text-gray-400">No results found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchBar;