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
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import ArtPostModal from "../../components/modals/artpostmodal";
import ArtworkLikes from "../../pages/likes/artworklikes";
import ArtworkComments from "../../pages/comments/artworkcomments";
import { CheckIcon } from "@heroicons/react/24/outline";

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

const ArtPosts = () => {
  const [artPosts, setArtPosts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Store tags for each post
  const [postTags, setPostTags] = useState({});

  // media viewer modal state (per-post)
  const [modalState, setModalState] = useState({
    isOpen: false,
    postIndex: null,
    mediaIndex: 0,
  });

  // ArtPostModal (edit/delete modal) state
  const [artPostModal, setArtPostModal] = useState({
    isOpen: false,
    type: "",
    post: null,
  });

  // dropdown open per post id
  const [dropdownOpen, setDropdownOpen] = useState(null);

  // per-post inline comments toggle & counts
  const [showCommentsMap, setShowCommentsMap] = useState({});
  const [commentCounts, setCommentCounts] = useState({});

  // per-post delete confirmation
  const [confirmDeleteFor, setConfirmDeleteFor] = useState(null);

  const userId = localStorage.getItem("id");
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

  // fetch posts + their media + tags
  const fetchArtPostsWithMedia = async () => {
    setLoading(true);
    setErrorMessage("");
    if (!token) {
      setErrorMessage("You must be logged in to view artwork posts.");
      setLoading(false);
      return;
    }

    try {
      const postsResponse = await axios.get(`${API_BASE}/api/artwork-posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const posts = postsResponse.data || [];

      // fetch media for each post in parallel
      const mediaRequests = posts.map((post) =>
        axios.get(`${API_BASE}/api/artwork-media/${post.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      );

      const mediaResponses = await Promise.all(mediaRequests);
      const postsWithMedia = posts.map((post, idx) => ({
        ...post,
        media: mediaResponses[idx]?.data || [],
      }));

      setArtPosts(postsWithMedia);

      // fetch comment counts and tags for each post
      postsWithMedia.forEach((p) => {
        fetchCommentCount(p.id);
        fetchTagsForPost(p.id);
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

  useEffect(() => {
    fetchArtPostsWithMedia();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle tag click - filter posts by tag (future feature)
  const handleTagClick = (tagName) => {
    console.log(`Filter by tag: ${tagName}`);
    // TODO: Implement filtering by tag
    // You can add this feature later to show only posts with this tag
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
      fetchArtPostsWithMedia();
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
  const openModal = (postIndex, mediaIndex = 0) => {
    setModalState({
      isOpen: true,
      postIndex,
      mediaIndex,
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      postIndex: null,
      mediaIndex: 0,
    });
  };

  const navigateMedia = (direction) => {
    if (modalState.postIndex === null) return;
    const mediaLength = artPosts[modalState.postIndex]?.media?.length || 0;
    if (mediaLength === 0) return;
    const newIndex =
      direction === "next"
        ? (modalState.mediaIndex + 1) % mediaLength
        : (modalState.mediaIndex - 1 + mediaLength) % mediaLength;

    setModalState((prev) => ({ ...prev, mediaIndex: newIndex }));
  };

  // render grid helpers
  const renderMediaGrid = (media, postIndex) => {
    const count = media.length;
    if (count === 1)
      return <ProtectedMedia file={media[0]} onClick={() => openModal(postIndex, 0)} className="w-full h-full" />;
    if (count === 2)
      return (
        <div className="grid grid-cols-2 gap-1">
          {media.map((file, index) => (
            <ProtectedMedia key={file.id} file={file} onClick={() => openModal(postIndex, index)} className="w-full h-full aspect-square" />
          ))}
        </div>
      );
    if (count === 3)
      return (
        <div className="grid grid-cols-2 gap-1">
          <div className="row-span-2 aspect-square">
            <ProtectedMedia file={media[0]} onClick={() => openModal(postIndex, 0)} className="w-full h-full" />
          </div>
          <div className="aspect-square">
            <ProtectedMedia file={media[1]} onClick={() => openModal(postIndex, 1)} className="w-full h-full" />
          </div>
          <div className="aspect-square">
            <ProtectedMedia file={media[2]} onClick={() => openModal(postIndex, 2)} className="w-full h-full" />
          </div>
        </div>
      );
    if (count === 4)
      return (
        <div className="grid grid-cols-2 gap-1">
          {media.map((file, index) => (
            <ProtectedMedia key={file.id} file={file} onClick={() => openModal(postIndex, index)} className="w-full h-full aspect-square" />
          ))}
        </div>
      );
    return (
      <div className="grid grid-cols-2 gap-1">
        {media.slice(0, 4).map((file, index) => (
          <div key={file.id} className={`aspect-square relative`}>
            <ProtectedMedia file={file} onClick={() => openModal(postIndex, index)} className="w-full h-full" />
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
        artPosts.map((post, postIndex) => (
          <div key={post.id} className="relative bg-white p-4 rounded-lg shadow-md border border-gray-200 mb-4 break-inside-avoid">
            {post.post_status === "down" && (
              <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center rounded-lg pointer-events-none">
                <p className="text-white text-lg font-semibold">🚫 Post is taken down</p>
              </div>
            )}

            <div className="flex items-center gap-3 mb-3">
              {post.author_pfp ? (
                <img src={`${API_BASE}/uploads/${post.author_pfp}`} alt={`${post.author}'s profile`} className="w-10 h-10 rounded-full border border-gray-300 object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-600 text-xs">N/A</span>
                </div>
              )}
              <div>
  <div className="flex items-center">
    <p className="font-bold text-gray-800">{post.author}</p>
    {post.is_verified && <VerifiedBadge />}
  </div>
  <p className="text-gray-600 text-sm">{post.fullname}</p>
</div>

              {String(post.author_id) === String(userId) && (
                <div className="ml-auto relative">
                  <button className="p-2 rounded-full hover:bg-gray-100" onClick={() => setDropdownOpen(dropdownOpen === post.id ? null : post.id)}>
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>

                  {dropdownOpen === post.id && (
                    <div className="absolute right-0 mt-2 w-36 bg-white shadow-lg rounded border border-gray-200 z-50">
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
                    </div>
                  )}
                </div>
              )}
            </div>

            <h4 className="text-base font-semibold text-gray-800 mb-2">{post.title}</h4>
            <p className="text-gray-600 mb-3">{post.description}</p>

            {/* Display Tags */}
            {postTags[post.id] && postTags[post.id].length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {postTags[post.id].map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => handleTagClick(tag.name)}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium hover:bg-blue-100 transition-colors"
                  >
                    <Tag size={12} />
                    #{tag.name}
                  </button>
                ))}
              </div>
            )}

            {post.media?.length > 0 && <div className="mt-3">{renderMediaGrid(post.media, postIndex)}</div>}

            {/* Likes & Comments inline row with date on the right */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <ArtworkLikes artworkPostId={post.id} />
                </div>

                <button onClick={() => toggleComments(post.id)} className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
                  <MessageCircle size={18} />
                  <span className="text-sm">{commentCounts[post.id] ?? 0}</span>
                </button>

                {confirmDeleteFor === post.id && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setConfirmDeleteFor(null)}
                      className="px-3 py-1 border rounded text-sm bg-white hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDeleteConfirmed(post.id)}
                      className="px-3 py-1 rounded text-sm bg-red-500 text-white hover:bg-red-600"
                    >
                      Confirm Delete
                    </button>
                  </div>
                )}
              </div>

              {/* Date moved to right side */}
              {post.created_at && (
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                </p>
              )}
            </div>

            {/* Comments Section */}
            {showCommentsMap[post.id] && (
              <div className="mt-2">
                <ArtworkComments artworkPostId={post.id} userId={userId} />
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center">No artwork posts yet.</p>
      )}

      {/* Media Viewer Modal with tags in sidebar */}
{modalState.isOpen && modalState.postIndex !== null && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
    <div className="relative max-w-6xl w-full max-h-[90vh] flex">
      {/* Image area */}
      <div className="flex-[2] relative flex items-center justify-center bg-black">
        {artPosts[modalState.postIndex]?.media?.length > 1 && (
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
          const currentMedia = artPosts[modalState.postIndex].media[modalState.mediaIndex];
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

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white z-20">
          {modalState.mediaIndex + 1} of {artPosts[modalState.postIndex].media.length}
        </div>
      </div>

      {/* Sidebar with tags */}
      <div className="flex-1 flex flex-col border-l border-gray-200 bg-white">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {artPosts[modalState.postIndex].author_pfp ? (
              <img
                src={`${API_BASE}/uploads/${artPosts[modalState.postIndex].author_pfp}`}
                alt={`${artPosts[modalState.postIndex].author}'s profile`}
                className="w-10 h-10 rounded-full border border-gray-300 object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-gray-600 text-xs">N/A</span>
              </div>
            )}
            <div>
  <div className="flex items-center">
    <p className="font-bold text-gray-800">{artPosts[modalState.postIndex].author}</p>
    {artPosts[modalState.postIndex].is_verified && <VerifiedBadge />}
  </div>
  <p className="text-gray-600 text-sm">{artPosts[modalState.postIndex].fullname}</p>
</div>
          </div>

          <p className="mt-3 text-gray-800">{artPosts[modalState.postIndex].title}</p>

          {/* Tags in modal */}
          {postTags[artPosts[modalState.postIndex].id] && postTags[artPosts[modalState.postIndex].id].length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {postTags[artPosts[modalState.postIndex].id].map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium"
                >
                  <Tag size={12} />
                  #{tag.name}
                </span>
              ))}
            </div>
          )}

          {/* Likes & Comments with date on the right */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-4">
              <ArtworkLikes artworkPostId={artPosts[modalState.postIndex].id} />
              <div className="flex items-center gap-1 text-gray-600">
                <MessageCircle size={18} />
                <span className="text-sm">{commentCounts[artPosts[modalState.postIndex].id] ?? 0}</span>
              </div>
            </div>

            {/* Date in modal - bottom right */}
            {artPosts[modalState.postIndex].created_at && (
              <p className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(artPosts[modalState.postIndex].created_at), { addSuffix: true })}
              </p>
            )}
          </div>
        </div>

        {/* Comments area (scrollable) */}
        <div className="flex-1 overflow-y-auto p-4">
          <ArtworkComments artworkPostId={artPosts[modalState.postIndex].id} userId={userId} />
        </div>
      </div>

      {/* GitHub-style Close Button */}
      <button 
        onClick={closeModal} 
        className="absolute top-4 right-4 flex items-center p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 border border-transparent hover:border-gray-300 bg-white/90 backdrop-blur-sm"
      >
        <X size={20} />
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
          onDelete={(postId) => {
            setConfirmDeleteFor(postId);
            setArtPostModal({ isOpen: false, type: "", post: null });
          }}
          onEdit={(postId, updatedData) => {
            handleEdit(postId, updatedData);
          }}
        />
      )}
    </div>
  );
};

export default ArtPosts;