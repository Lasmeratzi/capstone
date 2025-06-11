import React, { useEffect, useState } from "react";
import axios from "axios";
import Post from "../home/post";
import { ChevronDown, Calendar, SortAsc } from "lucide-react";

const OwnPost = ({ userId }) => {
  const [userPosts, setUserPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [sortOption, setSortOption] = useState("latest");
  const [yearFilter, setYearFilter] = useState("all");
  const [availableYears, setAvailableYears] = useState([]);
  const [showYearDropdown, setShowYearDropdown] = useState(false);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        if (!userId) return;

        const token = localStorage.getItem("token");
        if (!token) {
          setErrorMessage("Unauthorized: Please log in.");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/posts/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const normalizedPosts = response.data.map((post) => ({
          ...post,
          author_id: userId,
          createdAt: new Date(post.created_at),
        }));

        setUserPosts(normalizedPosts);
        setFilteredPosts(normalizedPosts);

        const years = [...new Set(normalizedPosts.map(post => 
          new Date(post.created_at).getFullYear()
        ))].sort((a, b) => b - a);

        setAvailableYears(years);
      } catch (error) {
        console.error("Failed to fetch user posts:", error);
        setErrorMessage("Failed to load posts. Please try again.");
      }
    };

    fetchUserPosts();
  }, [userId]);

  useEffect(() => {
    let result = [...userPosts];

    if (yearFilter !== "all") {
      result = result.filter(post =>
        new Date(post.created_at).getFullYear().toString() === yearFilter
      );
    }

    if (sortOption === "latest") {
      result.sort((a, b) => b.createdAt - a.createdAt);
    } else {
      result.sort((a, b) => a.createdAt - b.createdAt);
    }

    setFilteredPosts(result);
  }, [userPosts, sortOption, yearFilter]);

  const handleDelete = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserPosts(userPosts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Main Posts */}
      <div className="flex-1 space-y-4">
        {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <Post key={post.id} post={post} userId={userId} handleDelete={handleDelete} />
          ))
        ) : (
          <p className="text-gray-500 text-center text-sm">No posts available.</p>
        )}
      </div>

      {/* Filter Sidebar */}
      <div className="lg:w-64 space-y-4">
        {/* Sort Option */}
        <div className="mb-4">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
            <SortAsc size={16} /> Sort by
          </label>
          <select 
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm"
          >
            <option value="latest">Latest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>

        {/* Year Filter */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
            <Calendar size={16} /> Filter by year
          </label>
          <div className="relative">
            <button
              onClick={() => setShowYearDropdown(!showYearDropdown)}
              className="w-full flex items-center justify-between gap-1 bg-white border border-gray-300 rounded px-3 py-2 text-sm"
            >
              {yearFilter === "all" ? "All years" : yearFilter}
              <ChevronDown size={16} className={`transition-transform ${showYearDropdown ? "rotate-180" : ""}`} />
            </button>

            {showYearDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto">
                <button
                  onClick={() => {
                    setYearFilter("all");
                    setShowYearDropdown(false);
                  }}
                  className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${yearFilter === "all" ? "bg-gray-100 font-medium" : ""}`}
                >
                  All years
                </button>
                {availableYears.map((year) => (
                  <button
                    key={year}
                    onClick={() => {
                      setYearFilter(year.toString());
                      setShowYearDropdown(false);
                    }}
                    className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${yearFilter === year.toString() ? "bg-gray-100 font-medium" : ""}`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnPost;
