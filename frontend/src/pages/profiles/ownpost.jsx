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

        const normalizedPosts = response.data
          .filter((post) => String(post.author_id) === String(userId))
          .map((post) => ({
            ...post,
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
      {/* Main Posts - Centered */}
      <div className="flex-1">
        <div className="max-w-2xl mx-auto space-y-4">
          {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <Post key={post.id} post={post} userId={userId} handleDelete={handleDelete} />
            ))
          ) : (
            <p className="text-gray-500 text-center text-sm">No posts available.</p>
          )}
        </div>
      </div>

      {/* Filter Sidebar */}
      <div className="lg:w-64 space-y-6">
        {/* Sort Option */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
            <SortAsc size={16} /> Sort by
          </label>
          <div className="relative">
            <select 
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full bg-white dark:bg-[#0A0A0B] border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5E66FF]/50 appearance-none cursor-pointer transition-all"
            >
              <option value="latest">Latest first</option>
              <option value="oldest">Oldest first</option>
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Year Filter */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
            <Calendar size={16} /> Filter by year
          </label>
          <div className="relative">
            <button
              onClick={() => setShowYearDropdown(!showYearDropdown)}
              className="w-full flex items-center justify-between gap-1 bg-white dark:bg-[#0A0A0B] border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all cursor-pointer"
            >
              {yearFilter === "all" ? "All years" : yearFilter}
              <ChevronDown size={16} className={`transition-transform duration-300 ${showYearDropdown ? "rotate-180" : ""}`} />
            </button>

            {showYearDropdown && (
              <div className="absolute z-10 mt-2 w-full bg-white dark:bg-[#1C2128] border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl overflow-hidden overflow-y-auto max-h-60">
                <button
                  onClick={() => {
                    setYearFilter("all");
                    setShowYearDropdown(false);
                  }}
                  className={`block w-full text-left px-4 py-3 text-sm transition-colors hover:bg-gray-50 dark:hover:bg-white/5 ${yearFilter === "all" ? "text-[#5E66FF] font-bold" : "text-gray-600 dark:text-gray-400"}`}
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
                    className={`block w-full text-left px-4 py-3 text-sm transition-colors hover:bg-gray-50 dark:hover:bg-white/5 ${yearFilter === year.toString() ? "text-[#5E66FF] font-bold" : "text-gray-600 dark:text-gray-400"}`}
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

