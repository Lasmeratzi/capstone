import React, { useEffect, useState } from "react";
import axios from "axios";
import { X, ChevronDown, Calendar, SortAsc } from "lucide-react";

const API_BASE = "http://localhost:5000";

const OwnArt = ({ userId }) => {
  const [artPosts, setArtPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState("latest");
  const [yearFilter, setYearFilter] = useState("all");
  const [availableYears, setAvailableYears] = useState([]);
  const [showYearDropdown, setShowYearDropdown] = useState(false);

  useEffect(() => {
    const fetchOwnArtPosts = async () => {
      try {
        setLoading(true);
        if (!userId) return;

        const token = localStorage.getItem("token");
        if (!token) {
          setErrorMessage("Please log in to view your artwork");
          return;
        }

        const postsResponse = await axios.get(`${API_BASE}/api/artwork-posts/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const posts = postsResponse.data;
        const mediaRequests = posts.map((post) =>
          axios.get(`${API_BASE}/api/artwork-media/${post.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        );

        const mediaResponses = await Promise.all(mediaRequests);
        const postsWithMedia = posts.map((post, index) => ({
          ...post,
          media: mediaResponses[index].data || [],
          createdAt: new Date(post.created_at)
        }));

        setArtPosts(postsWithMedia);
        setFilteredPosts(postsWithMedia);
        
        const years = [...new Set(postsWithMedia.map(post => 
          new Date(post.created_at).getFullYear()
        ))].sort((a, b) => b - a);
        
        setAvailableYears(years);
      } catch (error) {
        console.error("Error fetching artwork:", error);
        setErrorMessage("Failed to load artwork posts");
      } finally {
        setLoading(false);
      }
    };

    fetchOwnArtPosts();
  }, [userId]);

  useEffect(() => {
    let result = [...artPosts];
    
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
  }, [artPosts, sortOption, yearFilter]);

  const handleDelete = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE}/api/artwork-posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setArtPosts(artPosts.filter(post => post.id !== postId));
    } catch (error) {
      console.error("Failed to delete artwork:", error);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Main content */}
      <div className="flex-1 space-y-4">
        {loading && (
          <div className="text-center py-8 text-gray-500">Loading artwork...</div>
        )}

        {errorMessage && (
          <p className="text-red-500 text-center">{errorMessage}</p>
        )}

        {!loading && filteredPosts.length === 0 ? (
          <p className="text-gray-500 text-center text-sm">No artwork posts found</p>
        ) : (
          filteredPosts.map((post) => (
            <div key={post.id} className="relative bg-white p-4 rounded-lg shadow-md text-sm max-w-2xl mx-auto lg:mx-0 mb-5 border border-gray-200">
              <div className="text-xs text-gray-500 mb-2">
                {new Date(post.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              
              <div className="flex items-center gap-3 mb-3">
                {post.author_pfp ? (
                  <img
                    src={`${API_BASE}/uploads/${post.author_pfp}`}
                    alt={`${post.author}'s profile`}
                    className="w-10 h-10 rounded-full border border-gray-300 object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-600 text-xs">N/A</span>
                  </div>
                )}
                <div>
                  <p className="font-bold text-gray-800">{post.author}</p>
                  <p className="text-gray-600 text-sm">{post.fullname}</p>
                </div>
              </div>

              <h4 className="text-base text-gray-800 mb-2">{post.title}</h4>
              <p className="text-gray-600 mb-3">{post.description}</p>

              {post.media?.length > 0 && (
                <div className={`grid gap-2 rounded-lg overflow-hidden ${
                  post.media.length === 1 ? "grid-cols-1" : "grid-cols-2"
                }`}>
                  {post.media.map((file) => (
                    <div 
                      key={file.id}
                      className="relative aspect-square cursor-pointer"
                      onClick={() => setSelectedMedia(file)}
                    >
                      <img
                        src={`${API_BASE}/uploads/artwork/${file.media_path}`}
                        alt="Artwork"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

    {/* Filter sidebar */}
<div className="lg:w-64 space-y-4">
  {/* Sort by latest/oldest */}
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

  {/* Year filter */}
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
          {availableYears.map(year => (
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

      {/* Image Modal */}
      {selectedMedia && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
          onClick={() => setSelectedMedia(null)}
        >
          <div 
            className="relative max-w-4xl w-full max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedMedia(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition"
              aria-label="Close image viewer"
            >
              <X size={32} />
            </button>
            
            <img
              src={`${API_BASE}/uploads/artwork/${selectedMedia.media_path}`}
              alt="Artwork preview"
              className="max-h-[80vh] w-auto max-w-full mx-auto rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnArt;