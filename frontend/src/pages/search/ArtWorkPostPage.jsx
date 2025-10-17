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

const ArtworkPostPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [postTags, setPostTags] = useState([]);
  
  const [modalState, setModalState] = useState({
    isOpen: false,
    mediaIndex: 0,
  });

  const [artPostModal, setArtPostModal] = useState({
    isOpen: false,
    type: "",
    post: null,
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showComments, setShowComments] = useState(true);
  const [commentCount, setCommentCount] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const userId = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchPostData();
  }, [postId]);

  const fetchPostData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const postResponse = await axios.get(
        `${API_BASE}/api/artwork-posts/${postId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const mediaResponse = await axios.get(
        `${API_BASE}/api/artwork-media/${postId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const tagsResponse = await axios.get(
        `${API_BASE}/api/tags/post/${postId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

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

  const handleDeleteConfirmed = async () => {
    try {
      await axios.delete(`${API_BASE}/api/artwork-posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate(-1);
    } catch (err) {
      console.error("Failed to delete post:", err);
      alert("Failed to delete post.");
    }
  };

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

      setArtPostModal({ isOpen: false, type: "", post: null });
      fetchPostData();
    } catch (err) {
      console.error("Failed to edit post:", err);
      alert("Failed to edit post.");
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
    if (!showComments) {
      fetchCommentCount();
    }
  };

  const fetchCommentCount = async () => {
    try {
      const res = await axios.get(
        `${API_BASE}/api/artwork-comments/count/${postId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCommentCount(res.data.count ?? 0);
    } catch (err) {
      console.error("Error fetching comment count:", err);
    }
  };

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
            <button
              onClick={() => navigate(-1)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="fixed h-screen w-60">
        <Sidebar />
      </div>

      <div className="ml-60 flex-grow py-6 px-4 md:px-8 lg:px-16">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Artwork Post</h1>
        </div>

        <div className="max-w-2xl mx-auto space-y-4">
          <div className="relative bg-white p-4 rounded-lg shadow-md border border-gray-200">
            {post.post_status === "down" && (
              <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center rounded-lg pointer-events-none">
                <p className="text-white text-lg font-semibold">🚫 Post is taken down</p>
              </div>
            )}

            {/* Post Header */}
            <div className="flex items-center gap-3 mb-3">
              <Link to={`/visitprofile/${post.author_id}`}>
                {post.author_pfp ? (
                  <img
                    src={`${API_BASE}/uploads/${post.author_pfp}`}
                    alt={`${post.author}'s profile`}
                    className="w-10 h-10 rounded-full border border-gray-300 object-cover hover:border-blue-500 transition-colors"
                    onError={(e) => {
                      e.target.src = "/default-avatar.png";
                    }}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-600 text-xs">N/A</span>
                  </div>
                )}
              </Link>
              <div>
                <Link
                  to={`/visitprofile/${post.author_id}`}
                  className="font-bold text-gray-800 hover:text-blue-600 transition-colors"
                >
                  {post.author}
                </Link>
                <p className="text-gray-600 text-sm">{post.fullname}</p>
                {post.created_at && (
                  <p className="text-xs text-gray-500">
                    Posted {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                  </p>
                )}
              </div>

              {String(post.author_id) === String(userId) && (
                <div className="ml-auto relative">
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
                          setConfirmDelete(true);
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

            <h2 className="text-base font-semibold text-gray-800 mb-2">{post.title}</h2>
            <p className="text-gray-600 mb-3">{post.description}</p>

            {postTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {postTags.map((tag) => (
                  <Link
                    key={tag.id}
                    to={`/tags/${tag.name}`}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium hover:bg-blue-100 transition-colors"
                  >
                    <Tag size={12} />
                    #{tag.name}
                  </Link>
                ))}
              </div>
            )}

            {/* MEDIA SECTION */}
            {post.media?.length > 0 && (
              <div className="mb-3">
                {renderMediaGrid(post.media)}
              </div>
            )}

            {/* LIKES & COMMENTS SECTION */}
            <div className="flex items-center gap-4 mt-3">
              <ArtworkLikes artworkPostId={post.id} />
              <button
                onClick={toggleComments}
                className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
              >
                <MessageCircle size={18} />
                <span className="text-sm">{commentCount}</span>
              </button>

              {confirmDelete && (
                <div className="ml-auto flex items-center gap-2">
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="px-3 py-1 border rounded text-sm bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirmed}
                    className="px-3 py-1 rounded text-sm bg-red-500 text-white hover:bg-red-600"
                  >
                    Confirm Delete
                  </button>
                </div>
              )}
            </div>

            {/* COMMENTS SECTION */}
            {showComments && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <ArtworkComments artworkPostId={post.id} userId={userId} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL CODE REMAINS THE SAME */}
      {modalState.isOpen && post.media && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative max-w-6xl w-full max-h-[90vh] flex">
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

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white z-20 bg-black bg-opacity-50 px-3 py-1 rounded-full">
                {modalState.mediaIndex + 1} of {post.media.length}
              </div>
            </div>

            <div className="flex-1 flex flex-col border-l border-gray-200 bg-white max-h-[90vh]">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
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
                    {post.created_at && (
                      <p className="text-xs text-gray-500">
                        Posted {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                      </p>
                    )}
                  </div>
                </div>

                <p className="mt-3 text-gray-800 font-semibold">{post.title}</p>

                {postTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {postTags.map((tag) => (
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

                <div className="flex items-center gap-4 mt-3">
                  <ArtworkLikes artworkPostId={post.id} />
                  <div className="flex items-center gap-1 text-gray-600">
                    <MessageCircle size={18} />
                    <span className="text-sm">{commentCount}</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <ArtworkComments artworkPostId={post.id} userId={userId} />
              </div>
            </div>

            <button onClick={closeModal} className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 z-30">
              <X size={24} />
            </button>
          </div>
        </div>
      )}

      {artPostModal.isOpen && (
        <ArtPostModal
          type={artPostModal.type}
          post={artPostModal.post}
          onClose={() => setArtPostModal({ isOpen: false, type: "", post: null })}
          onDelete={(postId) => {
            setConfirmDelete(true);
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

export default ArtworkPostPage;