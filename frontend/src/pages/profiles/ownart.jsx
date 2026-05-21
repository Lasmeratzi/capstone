import React, { useEffect, useState } from "react";
import axios from "axios";
import { X, ChevronDown, Calendar, SortAsc, MoreVertical, MessageCircle, Tag, ChevronLeft, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import ArtPostModal from "../../components/modals/artpostmodal";
import ArtworkLikes from "../../pages/likes/artworklikes";
import ArtworkComments from "../../pages/comments/artworkcomments";
import { CheckIcon } from "@heroicons/react/24/outline";
import { Globe, Users, Lock, Ban } from "lucide-react";

const API_BASE = "http://localhost:5000";

const VerifiedBadge = () => (
  <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 ml-2">
    <CheckIcon className="w-3 h-3 text-white" />
  </div>
);

const VisibilityBadge = ({ visibility }) => {
  const getVisibilityInfo = () => {
    switch (visibility) {
      case 'public':
        return { icon: <Globe size={14} />, text: 'Public', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' };
      case 'friends':
        return { icon: <Users size={14} />, text: 'Friends Only', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' };
      case 'private':
        return { icon: <Lock size={14} />, text: 'Private', color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-50 dark:bg-gray-900/20' };
      default:
        return { icon: <Globe size={14} />, text: 'Public', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' };
    }
  };

  const info = getVisibilityInfo();

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${info.bg} ${info.color} ml-2`}>
      {info.icon}
      <span>{info.text}</span>
    </div>
  );
};

const OwnArt = ({ userId }) => {
  const [artPosts, setArtPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState("latest");
  const [yearFilter, setYearFilter] = useState("all");
  const [availableYears, setAvailableYears] = useState([]);
  const [showYearDropdown, setShowYearDropdown] = useState(false);

  // Media viewer modal state
  const [modalState, setModalState] = useState({
    isOpen: false,
    post: null,
    mediaIndex: 0,
  });

  // Edit/delete functionality states
  const [postTags, setPostTags] = useState({});
  const [artPostModal, setArtPostModal] = useState({
    isOpen: false,
    type: "",
    post: null,
  });
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [showCommentsMap, setShowCommentsMap] = useState({});
  const [commentCounts, setCommentCounts] = useState({});
  const [confirmDeleteFor, setConfirmDeleteFor] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch tags for a specific post
  const fetchTagsForPost = async (postId) => {
    try {
      const response = await axios.get(`${API_BASE}/api/tags/post/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPostTags((prev) => ({ ...prev, [postId]: response.data }));
    } catch (err) {
      console.error(`Error fetching tags for post ${postId}:`, err);
      setPostTags((prev) => ({ ...prev, [postId]: [] }));
    }
  };

  const fetchCommentCount = async (artworkPostId) => {
    try {
      const res = await axios.get(
        `${API_BASE}/api/artwork-comments/count/${artworkPostId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCommentCounts((prev) => ({ ...prev, [artworkPostId]: res.data.count ?? 0 }));
    } catch (err) {
      console.error("Error fetching comment count:", err);
    }
  };

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

        // Fetch comment counts and tags for each post
        postsWithMedia.forEach((p) => {
          fetchCommentCount(p.id);
          fetchTagsForPost(p.id);
        });
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

  // Media viewer modal functions
  const openModal = (post, mediaIndex = 0) => {
    setModalState({
      isOpen: true,
      post,
      mediaIndex,
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      post: null,
      mediaIndex: 0,
    });
  };

  const navigateMedia = (direction) => {
    if (!modalState.post) return;
    const mediaLength = modalState.post?.media?.length || 0;
    if (mediaLength === 0) return;
    const newIndex =
      direction === "next"
        ? (modalState.mediaIndex + 1) % mediaLength
        : (modalState.mediaIndex - 1 + mediaLength) % mediaLength;

    setModalState((prev) => ({ ...prev, mediaIndex: newIndex }));
  };

  // Delete (actual API call)
  const handleDeleteConfirmed = async (postId) => {
    try {
      await axios.delete(`${API_BASE}/api/artwork-posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setArtPosts((prev) => prev.filter((p) => p.id !== postId));
      setConfirmDeleteFor(null);
      
      // clear comment toggles/counts and tags
      setShowCommentsMap((prev) => {
        const copy = { ...prev };
        delete copy[postId];
        return copy;
      });
      setCommentCounts((prev) => {
        const copy = { ...prev };
        delete copy[postId];
        return copy;
      });
      setPostTags((prev) => {
        const copy = { ...prev };
        delete copy[postId];
        return copy;
      });
    } catch (err) {
      console.error("Failed to delete post:", err);
      alert("Failed to delete post.");
    }
  };

  // Edit (actual API call)
  const handleEdit = async (postId, updatedData) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      let body = updatedData;
      if (updatedData instanceof FormData) {
        headers["Content-Type"] = "multipart/form-data";
      }
      await axios.patch(`${API_BASE}/api/artwork-posts/${postId}`, body, {
        headers,
      });

      setArtPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, ...Object.fromEntries(updatedData instanceof FormData ? [] : Object.entries(updatedData)) } : p))
      );

      setArtPostModal({ isOpen: false, type: "", post: null });
      // Refresh the data
      const fetchOwnArtPosts = async () => {
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
      };
      fetchOwnArtPosts();
    } catch (err) {
      console.error("Failed to edit post:", err);
      alert("Failed to edit post.");
    }
  };

  // Toggle inline comments
  const toggleComments = (postId) => {
    setShowCommentsMap((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
    fetchCommentCount(postId);
  };

  // Handle tag click
  const handleTagClick = (tagName) => {
    console.log(`Filter by tag: ${tagName}`);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Main content */}
      <div className="flex-1">
        <div className="max-w-2xl mx-auto space-y-4">
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
              <div key={post.id} className="relative bg-white dark:bg-[#0A0A0B] p-5 rounded-xl shadow-md border border-gray-200 dark:border-white/5 mb-6 transition-all duration-300">
                {post.post_status === "down" && (
                  <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center rounded-lg pointer-events-none z-10 gap-2">
                    <Ban className="text-white w-6 h-6" />
                    <p className="text-white text-lg font-semibold uppercase tracking-tight">Post is taken down</p>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-3">
                  {post.author_pfp ? (
                    <img src={`${API_BASE}/uploads/${post.author_pfp}`} alt={`${post.author}'s profile`} className="w-10 h-10 rounded-full border border-gray-300 dark:border-white/10 object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-white/5 flex items-center justify-center">
                      <span className="text-gray-600 dark:text-gray-400 text-xs">N/A</span>
                    </div>
                  )}
                  <div>
                    <div className="flex items-center">
                      <p className="font-bold text-gray-800 dark:text-gray-200">{post.author}</p>
                      {post.is_verified && <VerifiedBadge />}
                      <VisibilityBadge visibility={post.visibility} />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{post.fullname}</p>
                  </div>

                  <div className="ml-auto relative">
                    <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors" onClick={() => setDropdownOpen(dropdownOpen === post.id ? null : post.id)}>
                      <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>

                    {dropdownOpen === post.id && (
                      <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-[#1C2128] shadow-lg rounded-xl border border-gray-200 dark:border-white/5 z-50 overflow-hidden">
                        <button
                          className="w-full px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/5 text-left text-sm font-medium dark:text-gray-300 transition-colors"
                          onClick={() => {
                            setArtPostModal({ isOpen: true, type: "edit", post });
                            setDropdownOpen(null);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="w-full px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/5 text-left text-sm font-medium text-red-600 transition-colors"
                          onClick={() => {
                            setArtPostModal({ isOpen: true, type: "delete", post: post });
                            setDropdownOpen(null);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <h4 className="text-base font-bold text-gray-800 dark:text-gray-100 mb-2">{post.title}</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 leading-relaxed">{post.description}</p>

                {postTags[post.id] && postTags[post.id].length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {postTags[post.id].map((tag) => (
                      <button
                        key={tag.id}
                        onClick={() => handleTagClick(tag.name)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#5E66FF]/5 dark:bg-[#5E66FF]/10 text-[#5E66FF] dark:text-[#7C83FF] rounded-full text-[10px] font-bold uppercase tracking-wider hover:bg-[#5E66FF]/15 transition-colors border border-transparent dark:border-[#5E66FF]/20"
                      >
                        <Tag size={10} />
                        {tag.name}
                      </button>
                    ))}
                  </div>
                )}

                {post.media?.length > 0 && (
                  <div className={`grid gap-2 overflow-hidden ${
                    post.media.length === 1 ? "grid-cols-1" : "grid-cols-2"
                  }`}>
                    {post.media.map((file, index) => (
                      <div 
                        key={file.id}
                        className={`relative cursor-pointer overflow-hidden rounded-none ${post.media.length === 1 ? 'max-h-[500px] w-full' : 'aspect-square'}`}
                        onClick={() => openModal(post, index)}
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

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50 dark:border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <ArtworkLikes artworkPostId={post.id} />
                    </div>

                    <button onClick={() => toggleComments(post.id)} className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
                      <MessageCircle size={18} />
                      <span className="text-sm font-medium">{commentCounts[post.id] ?? 0}</span>
                    </button>

                    {confirmDeleteFor === post.id && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setConfirmDeleteFor(null)}
                          className="px-3 py-1 text-xs font-bold border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleDeleteConfirmed(post.id)}
                          className="px-3 py-1 text-xs font-bold rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors shadow-sm"
                        >
                          Confirm
                        </button>
                      </div>
                    )}
                  </div>

                  {post.created_at && (
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                      {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                    </p>
                  )}
                </div>

                {showCommentsMap[post.id] && (
                  <div className="mt-4 border-t border-gray-50 dark:border-white/5 pt-4">
                    <ArtworkComments artworkPostId={post.id} userId={userId} />
                  </div>
                )}
              </div>
            ))
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
              className="w-full bg-white dark:bg-[#161B22] border border-gray-200 dark:border-white/5 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5E66FF]/50 appearance-none cursor-pointer transition-all"
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
              className="w-full flex items-center justify-between gap-1 bg-white dark:bg-[#161B22] border border-gray-200 dark:border-white/5 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all cursor-pointer"
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

      {modalState.isOpen && modalState.post && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative max-w-6xl w-full max-h-[90vh] flex bg-white dark:bg-[#0A0A0B] rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Image area with navigation */}
            <div className="flex-[2] relative flex items-center justify-center bg-black">
              {modalState.post.media?.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateMedia("prev");
                    }}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 z-20"
                    aria-label="Previous"
                  >
                    <ChevronLeft size={32} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateMedia("next");
                    }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 z-20"
                    aria-label="Next"
                  >
                    <ChevronRight size={32} />
                  </button>
                </>
              )}

              {(() => {
                const currentMedia = modalState.post.media[modalState.mediaIndex];
                const mediaUrl = `${API_BASE}/uploads/artwork/${currentMedia.media_path}`;
                const isVideo = currentMedia.media_path.endsWith(".mp4");

                const handleContextMenu = (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                };

                const handleDragStart = (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                };

                return isVideo ? (
                  <video
                    src={mediaUrl}
                    controls
                    autoPlay
                    className="max-h-[80vh] w-full object-contain"
                    onContextMenu={handleContextMenu}
                    onDragStart={handleDragStart}
                    controlsList="nodownload"
                  />
                ) : (
                  <img
                    src={mediaUrl}
                    alt="Artwork media"
                    className="max-h-[80vh] w-auto max-w-full object-contain"
                    onContextMenu={handleContextMenu}
                    onDragStart={handleDragStart}
                    draggable={false}
                    style={{
                      userSelect: 'none',
                      WebkitUserSelect: 'none',
                      MozUserSelect: 'none',
                      msUserSelect: 'none',
                    }}
                  />
                );
              })()}

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white z-20 font-bold text-xs bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                {modalState.mediaIndex + 1} of {modalState.post.media.length}
              </div>
            </div>

            {/* Sidebar with post info, tags, likes, and comments */}
            <div className="flex-1 flex flex-col border-l border-gray-200 dark:border-white/5 bg-white dark:bg-[#0A0A0B]">
              <div className="p-5 border-b border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-3">
                  {modalState.post.author_pfp ? (
                    <img
                      src={`${API_BASE}/uploads/${modalState.post.author_pfp}`}
                      alt={`${modalState.post.author}'s profile`}
                      className="w-10 h-10 rounded-full border border-gray-200 dark:border-white/10 object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-white/5 flex items-center justify-center">
                      <span className="text-gray-600 dark:text-gray-400 text-xs">N/A</span>
                    </div>
                  )}
                  <div>
                    <div className="flex items-center">
                      <p className="font-bold text-gray-800 dark:text-gray-200">{modalState.post.author}</p>
                      {modalState.post.is_verified && <VerifiedBadge />}
                      <VisibilityBadge visibility={modalState.post.visibility} />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider font-bold">{modalState.post.fullname}</p>
                  </div>
                </div>

                <h4 className="mt-4 text-xl font-bold text-gray-900 dark:text-gray-100">{modalState.post.title}</h4>
                <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{modalState.post.description}</p>

                {postTags[modalState.post.id] && postTags[modalState.post.id].length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {postTags[modalState.post.id].map((tag) => (
                      <span
                        key={tag.id}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#5E66FF]/5 text-[#5E66FF] rounded-full text-[10px] font-bold uppercase tracking-wider"
                      >
                        <Tag size={10} />
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-50 dark:border-white/5">
                  <div className="flex items-center gap-5">
                    <ArtworkLikes artworkPostId={modalState.post.id} />
                    <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                      <MessageCircle size={20} />
                      <span className="text-sm font-bold">{commentCounts[modalState.post.id] ?? 0}</span>
                    </div>
                  </div>

                  {modalState.post.created_at && (
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                      {formatDistanceToNow(new Date(modalState.post.created_at), { addSuffix: true })}
                    </p>
                  )}
                </div>
              </div>

              {/* Comments area (scrollable) */}
              <div className="flex-1 overflow-y-auto p-5 no-scrollbar">
                <ArtworkComments artworkPostId={modalState.post.id} userId={userId} />
              </div>
            </div>

            <button onClick={closeModal} className="absolute top-5 right-5 text-white/50 hover:text-white transition-colors bg-black/20 hover:bg-black/40 rounded-full p-2.5 backdrop-blur-md border border-white/5 z-30">
              <X size={24} />
            </button>
          </div>
        </div>
      )}

      {/* ArtPostModal for edit/delete */}
      {artPostModal.isOpen && (
        <ArtPostModal
          type={artPostModal.type}
          post={artPostModal.post}
          onClose={() => setArtPostModal({ isOpen: false, type: "", post: null })}
          onDelete={async (postId) => {
            try {
              await axios.delete(`${API_BASE}/api/artwork-posts/${postId}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              
              setArtPosts((prev) => prev.filter((p) => String(p.id) !== String(postId)));
              setArtPostModal({ isOpen: false, type: "", post: null });
              
              setShowCommentsMap((prev) => {
                const copy = { ...prev };
                delete copy[postId];
                return copy;
              });
              setCommentCounts((prev) => {
                const copy = { ...prev };
                delete copy[postId];
                return copy;
              });
              setPostTags((prev) => {
                const copy = { ...prev };
                delete copy[postId];
                return copy;
              });
            } catch (err) {
              console.error("Failed to delete post:", err);
              alert("Failed to delete post.");
            }
          }}
          onEdit={(postId, updatedData) => {
            handleEdit(postId, updatedData);
          }}
        />
      )}
    </div>
  );
};

export default OwnArt;