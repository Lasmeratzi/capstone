// src/pages/artposts/artpost.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  X,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  MessageCircle,
  Tag,
  Flag,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import ArtPostModal from "../../components/modals/artpostmodal";
import { motion, AnimatePresence } from "framer-motion";
import ReportsModal from "../../components/modals/reportsmodal"; // ADD THIS IMPORT
import ArtworkLikes from "../../pages/likes/artworklikes";
import ArtworkComments from "../../pages/comments/artworkcomments";
import { CheckIcon } from "@heroicons/react/24/outline";
import { Globe, Users, Lock } from "lucide-react";

const API_BASE = "http://localhost:5000";

const VerifiedBadge = () => (
  <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 ml-2">
    <CheckIcon className="w-3 h-3 text-white" />
  </div>
);

const getMediaUrl = (media_path) => {
  const cleanPath = media_path.startsWith("uploads/")
    ? media_path.slice("uploads/".length)
    : media_path;
  return `${API_BASE}/uploads/artwork/${cleanPath}`;
};

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

// Protected Media Component - prevents right-click, drag, and selection
const ProtectedMedia = ({ file, onClick, className = "" }) => {
  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleSelectStart = (e) => {
    e.preventDefault();
  };

  const mediaUrl = getMediaUrl(file.media_path);
  const isVideo = file.media_path.endsWith(".mp4");

  return (
    <div
      className={`relative ${className}`}
      onClick={onClick}
      onContextMenu={handleContextMenu}
      onDragStart={handleDragStart}
      onSelectStart={handleSelectStart}
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
      }}
    >
      {isVideo ? (
        <div className="w-full h-full bg-black flex items-center justify-center relative">
          <video
            src={mediaUrl}
            className="w-full h-full object-cover pointer-events-none"
            muted
            preload="metadata"
            playsInline
            onContextMenu={handleContextMenu}
            onDragStart={handleDragStart}
          />
        </div>
      ) : (
        <img
          src={mediaUrl}
          alt="Artwork media"
          className="w-full h-full object-cover pointer-events-none"
          loading="lazy"
          onContextMenu={handleContextMenu}
          onDragStart={handleDragStart}
          onSelectStart={handleSelectStart}
          draggable={false}
        />
      )}
      {/* Invisible overlay to ensure clicks work but prevent other interactions */}
      <div 
        className="absolute inset-0 cursor-pointer"
        style={{ pointerEvents: 'auto' }}
        onClick={onClick}
        onContextMenu={handleContextMenu}
        onDragStart={handleDragStart}
      />
    </div>
  );
};

const ArtPosts = ({ initialArtworks = [], userId: propUserId, onDeleteArtwork }) => {
  // Use initialArtworks if provided, otherwise fetch from API
  const [artPosts, setArtPosts] = useState(initialArtworks.length > 0 ? initialArtworks : []);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(initialArtworks.length === 0); // Only load if no initial data

  // Store tags for each post
  const [postTags, setPostTags] = useState({});

  // media viewer modal state (per-post)
  const [modalState, setModalState] = useState({
    isOpen: false,
    activePostId: null,
    mediaIndex: 0,
  });

  // ArtPostModal (edit/delete modal) state
  const [artPostModal, setArtPostModal] = useState({
    isOpen: false,
    type: "",
    post: null,
  });

  // ADD THIS: Report modal state
  const [reportModal, setReportModal] = useState({
    isOpen: false,
    post: null,
  });

  // dropdown open per post id
  const [dropdownOpen, setDropdownOpen] = useState(null);

  // per-post inline comments toggle & counts
  const [showCommentsMap, setShowCommentsMap] = useState({});
  const [commentCounts, setCommentCounts] = useState({});

  // per-post delete confirmation
  const [confirmDeleteFor, setConfirmDeleteFor] = useState(null);

  // Use propUserId if provided, otherwise get from localStorage
  const userId = propUserId || localStorage.getItem("id");
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

  // fetch posts + their media + tags (only if no initialArtworks provided)
  const fetchArtPostsWithMedia = async () => {
    setLoading(true);
    setErrorMessage("");
    if (!token) {
      setErrorMessage("You must be logged in to view artwork posts.");
      setLoading(false);
      return;
    }

    try {
      // Try to fetch from followed users first
      let postsResponse;
      try {
        postsResponse = await axios.get(`${API_BASE}/api/artwork-posts/following`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (followError) {
        if (followError.response?.status === 404) {
          // If following endpoint doesn't exist yet, fall back to all posts
          console.log("Following endpoint not found, falling back to all artwork posts");
          postsResponse = await axios.get(`${API_BASE}/api/artwork-posts`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } else {
          throw followError;
        }
      }

      const posts = postsResponse.data || [];
      
      // Fetch media for each post
      const mediaRequests = posts.map((post) =>
        axios.get(`${API_BASE}/api/artwork-media/${post.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      );
      
      const mediaResponses = await Promise.all(mediaRequests);
      const postsWithMedia = posts.map((post, index) => ({
        ...post,
        media: mediaResponses[index].data || [],
      }));
      
      setArtPosts(postsWithMedia);
      
      // Fetch tags for each post
      postsWithMedia.forEach((p) => {
        fetchTagsForPost(p.id);
        fetchCommentCount(p.id);
      });
      
    } catch (err) {
      console.error("Failed to fetch artwork posts or media:", err);
      setErrorMessage("Failed to load artwork posts. Please try again.");
    } finally {
      setLoading(false);
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

  // Fetch media for initial artworks if they don't have media
  const fetchMediaForInitialArtworks = async () => {
    if (initialArtworks.length === 0) return;
    
    try {
      const postsWithMedia = await Promise.all(
        initialArtworks.map(async (post) => {
          try {
            const mediaRes = await axios.get(`${API_BASE}/api/artwork-media/${post.id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            return {
              ...post,
              media: mediaRes.data || [],
            };
          } catch (err) {
            console.error(`Error fetching media for post ${post.id}:`, err);
            return {
              ...post,
              media: [],
            };
          }
        })
      );
      
      setArtPosts(postsWithMedia);
      
      // Fetch tags and comment counts for each post
      postsWithMedia.forEach((p) => {
        fetchTagsForPost(p.id);
        fetchCommentCount(p.id);
      });
    } catch (err) {
      console.error("Error fetching media for initial artworks:", err);
    }
  };

  useEffect(() => {
    if (initialArtworks.length > 0) {
      // We have initial artworks, fetch their media
      fetchMediaForInitialArtworks();
    } else {
      // No initial artworks, fetch from API
      fetchArtPostsWithMedia();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialArtworks]);

  // Handle tag click - filter posts by tag (future feature)
  const handleTagClick = (tagName) => {
    console.log(`Filter by tag: ${tagName}`);
    // TODO: Implement filtering by tag
  };

  // Delete (actual API call)
  const handleDeleteConfirmed = async (postId) => {
    try {
      await axios.delete(`${API_BASE}/api/artwork-posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setArtPosts((prev) => prev.filter((p) => String(p.id) !== String(postId)));
      setConfirmDeleteFor(null);
      
      // Call parent's onDeleteArtwork if provided
      if (onDeleteArtwork) {
        onDeleteArtwork(postId);
      }
      
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
      
      // Refresh data
      if (initialArtworks.length > 0 && onDeleteArtwork) {
        // If we're in home page with initialArtworks, let parent handle refresh
        onDeleteArtwork(postId); // Reuse this to trigger parent refresh
      } else {
        fetchArtPostsWithMedia();
      }
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

  // Media viewer modal
  const openModal = (postId, mediaIndex = 0) => {
    setModalState({
      isOpen: true,
      activePostId: postId,
      mediaIndex,
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      activePostId: null,
      mediaIndex: 0,
    });
  };

  const navigateMedia = (direction) => {
    if (modalState.activePostId === null) return;
    const currentPost = artPosts.find(p => p.id === modalState.activePostId);
    const mediaLength = currentPost?.media?.length || 0;
    if (mediaLength === 0) return;
    const newIndex =
      direction === "next"
        ? (modalState.mediaIndex + 1) % mediaLength
        : (modalState.mediaIndex - 1 + mediaLength) % mediaLength;

    setModalState((prev) => ({ ...prev, mediaIndex: newIndex }));
  };

  // render grid helpers
  const renderMediaGrid = (media, postId) => {
    const count = media.length;
    if (count === 1)
      return (
        <div className="w-full max-h-[500px] overflow-hidden rounded-none">
          <ProtectedMedia file={media[0]} onClick={() => openModal(postId, 0)} className="w-full h-full object-cover" />
        </div>
      );
    if (count === 2)
      return (
        <div className="grid grid-cols-2 gap-1">
          {media.map((file, index) => (
            <ProtectedMedia key={file.id} file={file} onClick={() => openModal(postId, index)} className="w-full h-full aspect-square" />
          ))}
        </div>
      );
    if (count === 3)
      return (
        <div className="grid grid-cols-2 gap-1">
          <div className="row-span-2 aspect-square">
            <ProtectedMedia file={media[0]} onClick={() => openModal(postId, 0)} className="w-full h-full" />
          </div>
          <div className="aspect-square">
            <ProtectedMedia file={media[1]} onClick={() => openModal(postId, 1)} className="w-full h-full" />
          </div>
          <div className="aspect-square">
            <ProtectedMedia file={media[2]} onClick={() => openModal(postId, 2)} className="w-full h-full" />
          </div>
        </div>
      );
    if (count === 4)
      return (
        <div className="grid grid-cols-2 gap-1">
          {media.map((file, index) => (
            <ProtectedMedia key={file.id} file={file} onClick={() => openModal(postId, index)} className="w-full h-full aspect-square" />
          ))}
        </div>
      );
    return (
      <div className="grid grid-cols-2 gap-1">
        {media.slice(0, 4).map((file, index) => (
          <div key={file.id} className={`aspect-square relative`}>
            <ProtectedMedia file={file} onClick={() => openModal(postId, index)} className="w-full h-full" />
            {index === 3 && (
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center text-white font-bold text-xl pointer-events-none">
                +{media.length - 4}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  if (loading)
    return <div className="text-center p-6 text-gray-600">Loading artwork posts...</div>;

  if (errorMessage)
    return (
      <div className="text-center p-6 text-red-500">
        <p>{errorMessage}</p>
        <button onClick={fetchArtPostsWithMedia} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          Retry
        </button>
      </div>
    );

  return (
    <div className="w-full">
      {artPosts.length > 0 ? (
        <div className="w-full">
          {/* Mobile/Tablet view: Single Column (chronological) */}
          <div className="flex flex-col gap-8 md:hidden">
            {artPosts.map((post) => (
              <div key={post.id} className="relative bg-white dark:bg-[#0A0A0B] p-5 rounded-xl shadow-sm border border-gray-100 dark:border-white/5 transition-all duration-300">
                {post.post_status === "down" && (
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-30 rounded-xl">
                    <p className="text-white text-lg font-bold flex items-center gap-2">
                      <X className="w-5 h-5 text-red-500" />
                      Post Taken Down
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative group/pfp">
                      {post.author_pfp ? (
                        <img src={`${API_BASE}/uploads/${post.author_pfp}`} alt={`${post.author}'s profile`} className="w-11 h-11 rounded-full border-2 border-white dark:border-gray-800 shadow-sm object-cover" />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 text-xs font-bold">
                          {post.author?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center flex-wrap gap-1">
                        <p className="font-bold text-gray-900 dark:text-gray-100">{post.fullname}</p>
                        {post.is_verified && <VerifiedBadge />}
                        <VisibilityBadge visibility={post.visibility} />
                      </div>
                      <p className="text-gray-400 dark:text-gray-500 text-xs font-medium tracking-tight">@{post.author}</p>
                    </div>
                  </div>

                  <div className="relative">
                    <button 
                      className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer" 
                      onClick={() => setDropdownOpen(dropdownOpen === post.id ? null : post.id)}
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>

                    {dropdownOpen === post.id && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 shadow-2xl rounded-2xl border border-gray-100 dark:border-gray-800 z-50 overflow-hidden"
                      >
                        {String(post.author_id) === String(userId) && (
                          <>
                            <button
                              className="w-full px-4 py-2 hover:bg-gray-100 text-left"
                              onClick={() => {
                                setArtPostModal({ isOpen: true, type: "edit", post });
                                setDropdownOpen(null);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="w-full px-4 py-2 hover:bg-gray-100 text-left text-red-600"
                              onClick={() => {
                                setArtPostModal({ isOpen: true, type: "delete", post });
                                setDropdownOpen(null);
                              }}
                            >
                              Delete
                            </button>
                          </>
                        )}
                        {String(post.author_id) !== String(userId) && (
                          <button
                            className="w-full px-4 py-2 hover:bg-gray-100 text-left text-orange-500 flex items-center gap-2"
                            onClick={() => {
                              setReportModal({ isOpen: true, post });
                              setDropdownOpen(null);
                            }}
                          >
                            <Flag size={14} />
                            Report
                          </button>
                        )}
                      </motion.div>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1 leading-tight">{post.title}</h4>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{post.description}</p>
                </div>

                {postTags[post.id] && postTags[post.id].length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {postTags[post.id].map((tag) => (
                      <button
                        key={tag.id}
                        onClick={() => handleTagClick(tag.name)}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-xs font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                      >
                        <Tag size={12} />
                        #{tag.name}
                      </button>
                    ))}
                  </div>
                )}

                {post.media?.length > 0 && <div className="mt-4 overflow-hidden group transition-all duration-300">{renderMediaGrid(post.media, post.id)}</div>}

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-50 dark:border-gray-800/50">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1.5 group/like">
                      <ArtworkLikes artworkPostId={post.id} />
                    </div>
                    <button 
                      onClick={() => toggleComments(post.id)} 
                      className="flex items-center gap-2 text-gray-400 dark:text-gray-500 hover:text-[#5E66FF] transition-all cursor-pointer group/comment"
                    >
                      <div className="w-8 h-8 rounded-full flex items-center justify-center group-hover/comment:bg-blue-50 dark:group-hover/comment:bg-blue-900/20 transition-colors">
                        <MessageCircle size={18} />
                      </div>
                      <span className="text-sm font-bold">{commentCounts[post.id] ?? 0}</span>
                    </button>
                  </div>

                  {post.created_at && (
                    <div className="text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest">
                      {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop view: Two Columns */}
          <div className="hidden md:flex gap-8 items-start">
            {/* Left Column */}
            <div className="flex-1 flex flex-col gap-8">
              {artPosts.map((post, idx) => ({ post, idx })).filter(({ idx }) => idx % 2 === 0).map(({ post, idx }) => (
                <div key={post.id} className="relative bg-white dark:bg-[#0A0A0B] p-5 rounded-xl shadow-sm border border-gray-100 dark:border-white/5 transition-all duration-300">
                  {post.post_status === "down" && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-30 rounded-xl">
                      <p className="text-white text-lg font-bold flex items-center gap-2">
                        <X className="w-5 h-5 text-red-500" />
                        Post Taken Down
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="relative group/pfp">
                        {post.author_pfp ? (
                          <img src={`${API_BASE}/uploads/${post.author_pfp}`} alt={`${post.author}'s profile`} className="w-11 h-11 rounded-full border-2 border-white dark:border-gray-800 shadow-sm object-cover" />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 text-xs font-bold">
                            {post.author?.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center flex-wrap gap-1">
                          <p className="font-bold text-gray-900 dark:text-gray-100">{post.fullname}</p>
                          {post.is_verified && <VerifiedBadge />}
                          <VisibilityBadge visibility={post.visibility} />
                        </div>
                        <p className="text-gray-400 dark:text-gray-500 text-xs font-medium tracking-tight">@{post.author}</p>
                      </div>
                    </div>

                    <div className="relative">
                      <button 
                        className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer" 
                        onClick={() => setDropdownOpen(dropdownOpen === post.id ? null : post.id)}
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>

                      {dropdownOpen === post.id && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 shadow-2xl rounded-2xl border border-gray-100 dark:border-gray-800 z-50 overflow-hidden"
                        >
                          {String(post.author_id) === String(userId) && (
                            <>
                              <button
                                className="w-full px-4 py-2 hover:bg-gray-100 text-left"
                                onClick={() => {
                                  setArtPostModal({ isOpen: true, type: "edit", post });
                                  setDropdownOpen(null);
                                }}
                              >
                                Edit
                              </button>
                              <button
                                className="w-full px-4 py-2 hover:bg-gray-100 text-left text-red-600"
                                onClick={() => {
                                  setArtPostModal({ isOpen: true, type: "delete", post });
                                  setDropdownOpen(null);
                                }}
                              >
                                Delete
                              </button>
                            </>
                          )}
                          {String(post.author_id) !== String(userId) && (
                            <button
                              className="w-full px-4 py-2 hover:bg-gray-100 text-left text-orange-500 flex items-center gap-2"
                              onClick={() => {
                                setReportModal({ isOpen: true, post });
                                setDropdownOpen(null);
                              }}
                            >
                              <Flag size={14} />
                              Report
                            </button>
                          )}
                        </motion.div>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1 leading-tight">{post.title}</h4>
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{post.description}</p>
                  </div>

                  {postTags[post.id] && postTags[post.id].length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {postTags[post.id].map((tag) => (
                        <button
                          key={tag.id}
                          onClick={() => handleTagClick(tag.name)}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-xs font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                        >
                          <Tag size={12} />
                          #{tag.name}
                        </button>
                      ))}
                    </div>
                  )}

                  {post.media?.length > 0 && <div className="mt-4 overflow-hidden group transition-all duration-300">{renderMediaGrid(post.media, post.id)}</div>}

                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-50 dark:border-gray-800/50">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-1.5 group/like">
                        <ArtworkLikes artworkPostId={post.id} />
                      </div>
                      <button 
                        onClick={() => toggleComments(post.id)} 
                        className="flex items-center gap-2 text-gray-400 dark:text-gray-500 transition-all cursor-pointer group/comment"
                      >
                        <div className="w-8 h-8 rounded-full flex items-center justify-center group-hover/comment:bg-blue-50 dark:group-hover/comment:bg-blue-900/20 transition-colors">
                          <MessageCircle size={18} />
                        </div>
                        <span className="text-sm font-bold">{commentCounts[post.id] ?? 0}</span>
                      </button>
                    </div>

                    {post.created_at && (
                      <div className="text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest">
                        {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column */}
            <div className="flex-1 flex flex-col gap-8">
              {artPosts.map((post, idx) => ({ post, idx })).filter(({ idx }) => idx % 2 !== 0).map(({ post, idx }) => (
                <div key={post.id} className="relative bg-white dark:bg-[#0A0A0B] p-5 rounded-xl shadow-sm border border-gray-100 dark:border-white/5 transition-all duration-300">
                  {post.post_status === "down" && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-30 rounded-xl">
                      <p className="text-white text-lg font-bold flex items-center gap-2">
                        <X className="w-5 h-5 text-red-500" />
                        Post Taken Down
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="relative group/pfp">
                        {post.author_pfp ? (
                          <img src={`${API_BASE}/uploads/${post.author_pfp}`} alt={`${post.author}'s profile`} className="w-11 h-11 rounded-full border-2 border-white dark:border-gray-800 shadow-sm object-cover" />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 text-xs font-bold">
                            {post.author?.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center flex-wrap gap-1">
                          <p className="font-bold text-gray-900 dark:text-gray-100">{post.fullname}</p>
                          {post.is_verified && <VerifiedBadge />}
                          <VisibilityBadge visibility={post.visibility} />
                        </div>
                        <p className="text-gray-400 dark:text-gray-500 text-xs font-medium tracking-tight">@{post.author}</p>
                      </div>
                    </div>

                    <div className="relative">
                      <button 
                        className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer" 
                        onClick={() => setDropdownOpen(dropdownOpen === post.id ? null : post.id)}
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>

                      {dropdownOpen === post.id && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 shadow-2xl rounded-2xl border border-gray-100 dark:border-gray-800 z-50 overflow-hidden"
                        >
                          {String(post.author_id) === String(userId) && (
                            <>
                              <button
                                className="w-full px-4 py-2 hover:bg-gray-100 text-left"
                                onClick={() => {
                                  setArtPostModal({ isOpen: true, type: "edit", post });
                                  setDropdownOpen(null);
                                }}
                              >
                                Edit
                              </button>
                              <button
                                className="w-full px-4 py-2 hover:bg-gray-100 text-left text-red-600"
                                onClick={() => {
                                  setConfirmDeleteFor(post.id);
                                  setDropdownOpen(null);
                                }}
                              >
                                Delete
                              </button>
                            </>
                          )}
                          {String(post.author_id) !== String(userId) && (
                            <button
                              className="w-full px-4 py-2 hover:bg-gray-100 text-left text-orange-500 flex items-center gap-2"
                              onClick={() => {
                                setReportModal({ isOpen: true, post });
                                setDropdownOpen(null);
                              }}
                            >
                              <Flag size={14} />
                              Report
                            </button>
                          )}
                        </motion.div>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1 leading-tight">{post.title}</h4>
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{post.description}</p>
                  </div>

                  {postTags[post.id] && postTags[post.id].length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {postTags[post.id].map((tag) => (
                        <button
                          key={tag.id}
                          onClick={() => handleTagClick(tag.name)}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                        >
                          <Tag size={12} />
                          #{tag.name}
                        </button>
                      ))}
                    </div>
                  )}

                  {post.media?.length > 0 && <div className="mt-4 overflow-hidden group transition-all duration-300">{renderMediaGrid(post.media, post.id)}</div>}

                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-50 dark:border-gray-800/50">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-1.5 group/like">
                        <ArtworkLikes artworkPostId={post.id} />
                      </div>
                      <button 
                        onClick={() => toggleComments(post.id)} 
                        className="flex items-center gap-2 text-gray-400 dark:text-gray-500 transition-all cursor-pointer group/comment"
                      >
                        <div className="w-8 h-8 rounded-full flex items-center justify-center group-hover/comment:bg-blue-50 dark:group-hover/comment:bg-blue-900/20 transition-colors">
                          <MessageCircle size={18} />
                        </div>
                        <span className="text-sm font-bold">{commentCounts[post.id] ?? 0}</span>
                      </button>
                    </div>

                    {post.created_at && (
                      <div className="text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest">
                        {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-center">No artwork posts yet.</p>
      )}

      {/* Media Viewer Modal with tags in sidebar */}
      {modalState.isOpen && modalState.activePostId !== null && (() => {
        const activePost = artPosts.find(p => p.id === modalState.activePostId);
        if (!activePost) return null;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="relative max-w-6xl w-full max-h-[90vh] flex bg-white dark:bg-[#0A0A0B] rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-transparent dark:border-white/5">
              {/* Image area */}
              <div className="flex-[2] relative flex items-center justify-center bg-[#0F0F11]">
                {activePost.media?.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateMedia("prev");
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-md transition-all z-20 group"
                      aria-label="Previous"
                    >
                      <ChevronLeft size={28} className="group-hover:-translate-x-0.5 transition-transform" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateMedia("next");
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-md transition-all z-20 group"
                      aria-label="Next"
                    >
                      <ChevronRight size={28} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </>
                )}

                {(() => {
                  const currentMedia = activePost.media[modalState.mediaIndex];
                  if (!currentMedia) return null;
                  const mediaUrl = getMediaUrl(currentMedia.media_path);
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
                      className="max-h-[85vh] w-full object-contain"
                      onContextMenu={handleContextMenu}
                      onDragStart={handleDragStart}
                      controlsList="nodownload"
                    />
                  ) : (
                    <img
                      src={mediaUrl}
                      alt="Artwork media"
                      className="max-h-[85vh] w-auto max-w-full object-contain select-none shadow-2xl"
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

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-xs font-bold tracking-widest uppercase z-20 border border-white/10">
                  {modalState.mediaIndex + 1} / {activePost.media.length}
                </div>
              </div>

              {/* Sidebar with tags */}
              <div className="w-[380px] flex flex-col bg-white border-l border-gray-100">
                <div className="p-6 border-b border-gray-50">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      {activePost.author_pfp ? (
                        <img
                          src={`${API_BASE}/uploads/${activePost.author_pfp}`}
                          alt={`${activePost.author}'s profile`}
                          className="w-11 h-11 rounded-full border-2 border-white shadow-sm object-cover"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
                          <span className="text-gray-400 text-xs font-bold">NA</span>
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-1">
                          <p className="font-bold text-gray-900 leading-tight">{activePost.author}</p>
                          {activePost.is_verified && <VerifiedBadge />}
                        </div>
                        <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">{activePost.visibility}</p>
                      </div>
                    </div>
                    
                    {/* Close Button Inside Sidebar for better organization */}
                    <button 
                      onClick={closeModal} 
                      className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-all cursor-pointer"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2 leading-snug">
                    {activePost.title}
                  </h3>
                  
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">
                    {activePost.fullname}
                  </p>

                  {/* Tags in modal */}
                  {postTags[activePost.id] && postTags[activePost.id].length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {postTags[activePost.id].map((tag) => (
                        <span
                          key={tag.id}
                          className="inline-flex items-center px-2.5 py-1 bg-gray-50 text-gray-600 rounded-lg text-[11px] font-bold uppercase tracking-wider border border-gray-100"
                        >
                          #{tag.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Interaction Row */}
                  <div className="flex items-center justify-between mt-6 pt-5 border-t border-gray-50">
                    <div className="flex items-center gap-6">
                      <ArtworkLikes artworkPostId={activePost.id} />
                      <div className="flex items-center gap-2 text-gray-400">
                        <MessageCircle size={20} />
                        <span className="text-sm font-bold">{commentCounts[activePost.id] ?? 0}</span>
                      </div>
                    </div>

                    {activePost.created_at && (
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {formatDistanceToNow(new Date(activePost.created_at), { addSuffix: true })}
                      </p>
                    )}
                  </div>
                </div>

                {/* Comments area (scrollable) */}
                <div className="flex-1 overflow-y-auto bg-gray-50/30">
                  <div className="p-6">
                    <ArtworkComments artworkPostId={activePost.id} userId={userId} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
      
      {/* ArtPostModal for edit/delete */}
      {artPostModal.isOpen && (
        <ArtPostModal
          type={artPostModal.type}
          post={artPostModal.post}
          onClose={() => setArtPostModal({ isOpen: false, type: "", post: null })}
          onDelete={(postId) => {
            handleDeleteConfirmed(postId);
            setArtPostModal({ isOpen: false, type: "", post: null });
          }}
          onEdit={(postId, updatedData) => {
            handleEdit(postId, updatedData);
          }}
        />
      )}
      
      {/* ADD THIS: Report Modal */}
      {reportModal.isOpen && reportModal.post && (
        <ReportsModal
          isOpen={reportModal.isOpen}
          onClose={() => setReportModal({ isOpen: false, post: null })}
          contentType="artwork"
          contentId={reportModal.post.id}
          contentAuthorId={reportModal.post.author_id}
        />
      )}
    </div>
  );
};

export default ArtPosts;