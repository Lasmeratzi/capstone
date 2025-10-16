// src/pages/artposts/ArtworkPostPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  X,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  MessageCircle,
  Tag,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import ArtPostModal from "../../components/modals/artpostmodal";
import ArtworkLikes from "../likes/artworklikes";
import ArtworkComments from "../comments/artworkcomments";
import Sidebar from "../sidebar/sidebar";

const API_BASE = "http://localhost:5000";

const getMediaUrl = (media_path) => {
  const cleanPath = media_path.startsWith("uploads/")
    ? media_path.slice("uploads/".length)
    : media_path;
  return `${API_BASE}/uploads/artwork/${cleanPath}`;
};

const ProtectedMedia = ({ file, onClick, className = "" }) => {
  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const mediaUrl = getMediaUrl(file.media_path);
  const isVideo = file.media_path.endsWith(".mp4");

  return (
    <div
      className={`relative ${className}`}
      onClick={onClick}
      onContextMenu={handleContextMenu}
      onDragStart={handleDragStart}
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
          draggable={false}
        />
      )}
    </div>
  );
};

const ArtworkPostPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Store tags for the post
  const [postTags, setPostTags] = useState([]);
  
  // Media viewer modal state
  const [modalState, setModalState] = useState({
    isOpen: false,
    mediaIndex: 0,
  });

  // ArtPostModal (edit/delete modal) state
  const [artPostModal, setArtPostModal] = useState({
    isOpen: false,
    type: "",
    post: null,
  });

  // Dropdown open state
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Comments state
  const [showComments, setShowComments] = useState(true);
  const [commentCount, setCommentCount] = useState(0);

  const userId = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchPostData();
  }, [postId]);

  const fetchPostData = async () => {
    setLoading(true);
    setError("");
    
    try {
      // Fetch post details
      const postResponse = await axios.get(
        `${API_BASE}/api/artwork-posts/${postId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Fetch media for the post
      const mediaResponse = await axios.get(
        `${API_BASE}/api/artwork-media/${postId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Fetch tags for the post
      const tagsResponse = await axios.get(
        `${API_BASE}/api/tags/post/${postId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Fetch comment count
      const commentCountResponse = await axios.get(
        `${API_BASE}/api/artwork-comments/count/${postId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPost({
        ...postResponse.data,
        media: mediaResponse.data || [],
      });
      setPostTags(tagsResponse.data || []);
      setCommentCount(commentCountResponse.data.count || 0);

    } catch (err) {
      console.error("Error fetching post data:", err);
      setError("Failed to load post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Media viewer modal functions
  const openModal = (mediaIndex = 0) => {
    setModalState({
      isOpen: true,
      mediaIndex,
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      mediaIndex: 0,
    });
  };

  const navigateMedia = (direction) => {
    if (!post?.media?.length) return;
    
    const mediaLength = post.media.length;
    const newIndex =
      direction === "next"
        ? (modalState.mediaIndex + 1) % mediaLength
        : (modalState.mediaIndex - 1 + mediaLength) % mediaLength;

    setModalState((prev) => ({ ...prev, mediaIndex: newIndex }));
  };

  // Render media grid (same as your artpost.jsx)
  const renderMediaGrid = (media) => {
    const count = media.length;
    if (count === 1)
      return <ProtectedMedia file={media[0]} onClick={() => openModal(0)} className="w-full h-full rounded-lg cursor-pointer" />;
    if (count === 2)
      return (
        <div className="grid grid-cols-2 gap-1">
          {media.map((file, index) => (
            <ProtectedMedia key={file.id} file={file} onClick={() => openModal(index)} className="w-full h-full aspect-square rounded-lg cursor-pointer" />
          ))}
        </div>
      );
    if (count === 3)
      return (
        <div className="grid grid-cols-2 gap-1">
          <div className="row-span-2 aspect-square">
            <ProtectedMedia file={media[0]} onClick={() => openModal(0)} className="w-full h-full rounded-lg cursor-pointer" />
          </div>
          <div className="aspect-square">
            <ProtectedMedia file={media[1]} onClick={() => openModal(1)} className="w-full h-full rounded-lg cursor-pointer" />
          </div>
          <div className="aspect-square">
            <ProtectedMedia file={media[2]} onClick={() => openModal(2)} className="w-full h-full rounded-lg cursor-pointer" />
          </div>
        </div>
      );
    if (count === 4)
      return (
        <div className="grid grid-cols-2 gap-1">
          {media.map((file, index) => (
            <ProtectedMedia key={file.id} file={file} onClick={() => openModal(index)} className="w-full h-full aspect-square rounded-lg cursor-pointer" />
          ))}
        </div>
      );
    return (
      <div className="grid grid-cols-2 gap-1">
        {media.slice(0, 4).map((file, index) => (
          <div key={file.id} className={`aspect-square relative`}>
            <ProtectedMedia file={file} onClick={() => openModal(index)} className="w-full h-full rounded-lg cursor-pointer" />
            {index === 3 && (
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center text-white font-bold text-xl pointer-events-none rounded-lg">
                +{media.length - 4}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex">
        <div className="fixed h-screen w-60">
          <Sidebar />
        </div>
        <div className="ml-60 flex-grow py-6 px-8 md:px-20 lg:px-40">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading post...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex">
        <div className="fixed h-screen w-60">
          <Sidebar />
        </div>
        <div className="ml-60 flex-grow py-6 px-8 md:px-20 lg:px-40">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
            <button
              onClick={fetchPostData}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex">
        <div className="fixed h-screen w-60">
          <Sidebar />
        </div>
        <div className="ml-60 flex-grow py-6 px-8 md:px-20 lg:px-40">
          <div className="text-center py-12">
            <p className="text-gray-500">Post not found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <div className="fixed h-screen w-60">
        <Sidebar />
      </div>

      <div className="ml-60 flex-grow py-6 px-8 md:px-20 lg:px-40">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Artwork Post</h1>
        </div>

        {/* Post Content */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          {/* Post Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              {post.author_pfp ? (
                <img
                  src={`${API_BASE}/uploads/${post.author_pfp}`}
                  alt={`${post.author}'s profile`}
                  className="w-12 h-12 rounded-full border border-gray-300 object-cover"
                  onError={(e) => {
                    e.target.src = "/default-avatar.png";
                  }}
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-600 text-xs">N/A</span>
                </div>
              )}
              <div className="flex-1">
                <p className="font-bold text-gray-800 text-lg">{post.author}</p>
                <p className="text-gray-600">{post.fullname}</p>
                {post.created_at && (
                  <p className="text-sm text-gray-500">
                    Posted {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                  </p>
                )}
              </div>

              {String(post.author_id) === String(userId) && (
                <div className="relative">
                  <button
                    className="p-2 rounded-full hover:bg-gray-100"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-36 bg-white shadow-lg rounded border border-gray-200 z-50">
                      <button
                        className="w-full px-4 py-2 hover:bg-gray-100 text-left"
                        onClick={() => {
                          setArtPostModal({ isOpen: true, type: "edit", post });
                          setDropdownOpen(false);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="w-full px-4 py-2 hover:bg-gray-100 text-left text-red-600"
                        onClick={() => {
                          setArtPostModal({ isOpen: true, type: "delete", post });
                          setDropdownOpen(false);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <h2 className="text-xl font-semibold text-gray-800 mt-4">{post.title}</h2>
            <p className="text-gray-600 mt-2">{post.description}</p>

            {/* Display Tags */}
            {postTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {postTags.map((tag) => (
                  <Link
                    key={tag.id}
                    to={`/tags/${tag.name}`}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors"
                  >
                    <Tag size={14} />
                    #{tag.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Likes & Comments */}
            <div className="flex items-center gap-6 mt-4">
              <ArtworkLikes artworkPostId={post.id} />
              <button
                onClick={() => setShowComments(!showComments)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <MessageCircle size={20} />
                <span className="font-medium">{commentCount}</span>
                <span>Comments</span>
              </button>
            </div>
          </div>

          {/* Media */}
          {post.media?.length > 0 && (
            <div className="p-6">
              {renderMediaGrid(post.media)}
            </div>
          )}

          {/* Comments Section */}
          {showComments && (
            <div className="border-t border-gray-200">
              <div className="p-6">
                <ArtworkComments artworkPostId={post.id} userId={userId} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Media Viewer Modal */}
      {modalState.isOpen && post.media && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative max-w-6xl w-full max-h-[90vh] flex">
            {/* Image area */}
            <div className="flex-[2] relative flex items-center justify-center bg-black">
              {post.media.length > 1 && (
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
                const currentMedia = post.media[modalState.mediaIndex];
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
                {modalState.mediaIndex + 1} of {post.media.length}
              </div>
            </div>

            <button onClick={closeModal} className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 z-30">
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
          onDelete={(postId) => {
            // Handle delete and navigate back
            navigate(-1);
          }}
          onEdit={(postId, updatedData) => {
            // Handle edit and refresh data
            fetchPostData();
          }}
        />
      )}
    </div>
  );
};

export default ArtworkPostPage;