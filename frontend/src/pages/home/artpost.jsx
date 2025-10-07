import React, { useEffect, useState } from "react";
import axios from "axios";
import { X, ChevronLeft, ChevronRight, MoreVertical, MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import ArtworkLikes from "../../pages/likes/artworklikes";
import ArtworkComments from "../../pages/comments/artworkcomments";

const API_BASE = "http://localhost:5000";

const getMediaUrl = (media_path) => {
  const cleanPath = media_path.startsWith("uploads/")
    ? media_path.slice("uploads/".length)
    : media_path;
  return `${API_BASE}/uploads/artwork/${cleanPath}`;
};

const ArtPosts = () => {
  const [artPosts, setArtPosts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    postIndex: null,
    mediaIndex: 0
  });
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const [showCommentsMap, setShowCommentsMap] = useState({});
  const [commentCounts, setCommentCounts] = useState({});

  const userId = localStorage.getItem("id");
  const token = localStorage.getItem("token");

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
      }));

      setArtPosts(postsWithMedia);
      postsWithMedia.forEach((post) => fetchCommentCount(post.id));
    } catch (error) {
      console.error("Failed to fetch artwork posts or media:", error);
      setErrorMessage("Failed to load artwork posts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCommentCount = async (artworkPostId) => {
    try {
      const res = await axios.get(`${API_BASE}/api/artwork-comments/count/${artworkPostId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCommentCounts((prev) => ({ ...prev, [artworkPostId]: res.data.count ?? 0 }));
    } catch (err) {
      console.error("Error fetching comment count:", err);
    }
  };

  useEffect(() => {
    fetchArtPostsWithMedia();
  }, []);

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`${API_BASE}/api/artwork-posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setArtPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch (err) {
      console.error("Failed to delete post:", err);
      alert("Failed to delete post.");
    }
  };

  const handleEdit = async (postId, updatedData) => {
    try {
      await axios.patch(`${API_BASE}/api/artwork-posts/${postId}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setArtPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, ...updatedData } : p))
      );
    } catch (err) {
      console.error("Failed to edit post:", err);
      alert("Failed to edit post.");
    }
  };

  const toggleComments = (postId) => {
    setShowCommentsMap((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const openModal = (postIndex, mediaIndex = 0) => {
    setModalState({
      isOpen: true,
      postIndex,
      mediaIndex
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      postIndex: null,
      mediaIndex: 0
    });
  };

  const navigateMedia = (direction) => {
    if (modalState.postIndex === null) return;
    const mediaLength = artPosts[modalState.postIndex].media.length;
    const newIndex =
      direction === "next"
        ? (modalState.mediaIndex + 1) % mediaLength
        : (modalState.mediaIndex - 1 + mediaLength) % mediaLength;

    setModalState((prev) => ({
      ...prev,
      mediaIndex: newIndex
    }));
  };

  const renderMediaGrid = (media, postIndex) => {
    const count = media.length;
    if (count === 1)
      return (
        <MediaItem
          file={media[0]}
          onClick={() => openModal(postIndex, 0)}
        />
      );
    if (count === 2)
      return (
        <div className="grid grid-cols-2 gap-1">
          {media.map((file, index) => (
            <MediaItem
              key={file.id}
              file={file}
              onClick={() => openModal(postIndex, index)}
            />
          ))}
        </div>
      );
    if (count === 3)
      return (
        <div className="grid grid-cols-2 gap-1">
          <div className="row-span-2 aspect-square">
            <MediaItem
              file={media[0]}
              onClick={() => openModal(postIndex, 0)}
            />
          </div>
          <div className="aspect-square">
            <MediaItem
              file={media[1]}
              onClick={() => openModal(postIndex, 1)}
            />
          </div>
          <div className="aspect-square">
            <MediaItem
              file={media[2]}
              onClick={() => openModal(postIndex, 2)}
            />
          </div>
        </div>
      );
    if (count === 4)
      return (
        <div className="grid grid-cols-2 gap-1">
          {media.map((file, index) => (
            <MediaItem
              key={file.id}
              file={file}
              onClick={() => openModal(postIndex, index)}
            />
          ))}
        </div>
      );
    return (
      <div className="grid grid-cols-2 gap-1">
        {media.slice(0, 4).map((file, index) => (
          <div
            key={file.id}
            className={`aspect-square relative ${index === 3 ? "cursor-pointer" : ""}`}
            onClick={() => openModal(postIndex, index)}
          >
            <MediaItem file={file} />
            {index === 3 && (
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center text-white font-bold text-xl">
                +{media.length - 4}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const MediaItem = ({ file, onClick }) => (
    <div className="w-full h-full" onClick={onClick}>
      {file.media_path.endsWith(".mp4") ? (
        <div className="w-full h-full bg-black flex items-center justify-center relative">
          <video
            src={getMediaUrl(file.media_path)}
            className="w-full h-full object-cover"
            muted
            preload="metadata"
            playsInline
          />
        </div>
      ) : (
        <img
          src={getMediaUrl(file.media_path)}
          alt="Artwork media"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      )}
    </div>
  );

  if (loading)
    return (
      <div className="text-center p-6 text-gray-600">
        Loading artwork posts...
      </div>
    );
  if (errorMessage)
    return (
      <div className="text-center p-6 text-red-500">
        <p>{errorMessage}</p>
        <button
          onClick={fetchArtPostsWithMedia}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Retry
        </button>
      </div>
    );

  return (
    <div className="w-full">
      {artPosts.length > 0 ? (
        artPosts.map((post, postIndex) => (
          <div
            key={post.id}
            className="relative bg-white p-4 rounded-lg shadow-md border border-gray-200 mb-4 break-inside-avoid"
          >
            {post.post_status === "down" && (
              <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center rounded-lg pointer-events-none">
                <p className="text-white text-lg font-semibold">
                  🚫 Post is taken down
                </p>
              </div>
            )}

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
                {post.created_at && (
                  <p className="text-xs text-gray-500">
                    Posted{" "}
                    {formatDistanceToNow(new Date(post.created_at), {
                      addSuffix: true,
                    })}
                  </p>
                )}
              </div>

              {String(post.author_id) === String(userId) && (
                <div className="ml-auto relative">
                  <button
                    className="p-2 rounded-full hover:bg-gray-100"
                    onClick={() =>
                      setDropdownOpen(
                        dropdownOpen === post.id ? null : post.id
                      )
                    }
                  >
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>

                  {dropdownOpen === post.id && (
                    <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded border border-gray-200 z-50">
                      <button
                        className="w-full px-4 py-2 hover:bg-gray-100 text-left"
                        onClick={() => handleEdit(post.id, post)}
                      >
                        Edit
                      </button>
                      <button
                        className="w-full px-4 py-2 hover:bg-gray-100 text-left text-red-600"
                        onClick={() => handleDelete(post.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <h4 className="text-base font-semibold text-gray-800 mb-2">
              {post.title}
            </h4>
            <p className="text-gray-600 mb-3">{post.description}</p>
            {post.media?.length > 0 && (
              <div className="mt-3">{renderMediaGrid(post.media, postIndex)}</div>
            )}

            {/* Likes & Comments */}
            <div className="flex items-center gap-4 mt-3">
              <ArtworkLikes artworkPostId={post.id} />
              <button
                onClick={() => toggleComments(post.id)}
                className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
              >
                <MessageCircle size={18} />
                <span className="text-sm">{commentCounts[post.id] ?? 0}</span>
              </button>
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

      {/* Modal */}
      {modalState.isOpen && modalState.postIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
        >
          <div className="relative max-w-6xl w-full max-h-[90vh] flex">
            <div className="flex-[2] relative flex items-center justify-center">
              {/* Navigation */}
              {artPosts[modalState.postIndex].media.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateMedia("prev");
                    }}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 z-10"
                  >
                    <ChevronLeft size={32} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateMedia("next");
                    }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 z-10"
                  >
                    <ChevronRight size={32} />
                  </button>
                </>
              )}

              {/* Image */}
              {artPosts[modalState.postIndex].media[modalState.mediaIndex].media_path.endsWith(".mp4") ? (
                <video
                  src={getMediaUrl(artPosts[modalState.postIndex].media[modalState.mediaIndex].media_path)}
                  controls
                  autoPlay
                  className="max-h-[80vh] w-full object-contain"
                />
              ) : (
                <img
                  src={getMediaUrl(artPosts[modalState.postIndex].media[modalState.mediaIndex].media_path)}
                  alt="Artwork media"
                  className="max-h-[80vh] w-auto max-w-full object-contain"
                />
              )}
            </div>

            {/* Sidebar */}
            <div className="flex-1 flex flex-col border-l border-gray-200 bg-white">
              <div className="p-4 border-b border-gray-200 flex flex-col">
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
                    <p className="font-bold text-gray-800">{artPosts[modalState.postIndex].author}</p>
                    <p className="text-gray-600 text-sm">{artPosts[modalState.postIndex].fullname}</p>
                  </div>
                </div>
                <p className="mt-3 text-gray-800">{artPosts[modalState.postIndex].title}</p>

                {/* Likes & Comments */}
                <div className="flex items-center gap-4 mt-3">
                  <ArtworkLikes artworkPostId={artPosts[modalState.postIndex].id} />
                  <div className="flex items-center gap-1 text-gray-600">
                    <MessageCircle size={18} />
                    <span className="text-sm">{commentCounts[artPosts[modalState.postIndex].id] ?? 0}</span>
                  </div>
                </div>
              </div>

              {/* Comments */}
              <div className="flex-1 overflow-y-auto p-4">
                <ArtworkComments artworkPostId={artPosts[modalState.postIndex].id} userId={userId} />
              </div>
            </div>

            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtPosts;
