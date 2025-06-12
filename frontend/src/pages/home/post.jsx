import React, { useState, useEffect } from "react";
import { MessageCircle, MoreVertical, Loader, Trash, Pencil, X } from "lucide-react";
import axios from "axios";
import Comments from "../comments/comments";
import { FaCheckCircle } from "react-icons/fa";

const VerifiedBadge = () => (
  <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 ml-1">
    <FaCheckCircle className="w-3 h-3 text-white" />
  </div>
);

const Post = ({ post, userId, handleDelete }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(post.title);
  const [editedMedia, setEditedMedia] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // Fetch comment count
  const fetchCommentCount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(
        `http://localhost:5000/api/comments/count/${post.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCommentCount(response.data.count ?? 0);
    } catch (error) {
      console.error("Failed to fetch comment count", error);
      setCommentCount(0);
    }
  };

  useEffect(() => {
    fetchCommentCount();
  }, [post.id]);

  const handleEditSubmit = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token missing!");
        return;
      }

      const formData = new FormData();
      formData.append("title", editedTitle);
      if (editedMedia) {
        formData.append("media", editedMedia);
      }

      const response = await axios.patch(
        `http://localhost:5000/api/posts/${post.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setIsEditing(false);
      setMenuOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Failed to update post:", error);
      alert("Failed to update post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDeletePost = () => {
    setConfirmDelete(false);
    handleDelete(post.id);
  };

  return (
    <div className="relative bg-white p-4 rounded-lg shadow-md text-sm max-w-2xl mx-auto lg:ml-0 mb-5 border border-gray-200">
      {post.post_status === "down" && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center rounded-lg">
          <p className="text-white text-lg font-semibold">🚫 Post is taken down</p>
        </div>
      )}

      {/* Post Header with Author Info & 3-Dot Menu */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {post.author_pfp ? (
            <img
              src={`http://localhost:5000/uploads/${post.author_pfp}`}
              alt={post.author}
              className="w-10 h-10 rounded-full border border-gray-300"
            />
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
            {post.verification_request_status === "pending" && (
              <span className="text-xs text-yellow-500">Verification pending</span>
            )}
            {post.verification_request_status === "rejected" && (
              <span className="text-xs text-red-500">Verification rejected</span>
            )}
          </div>
        </div>

        {/* Three-dot menu for own posts */}
        {post.author_id === userId && (
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              <MoreVertical size={20} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border transform transition-all duration-200">
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition"
                >
                  <Pencil size={16} />
                  Edit Post
                </button>
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="flex items-center gap-2 w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100 transition"
                >
                  <Trash size={16} />
                  Delete Post
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Rest of the post content */}
      {!isEditing ? (
        <>
          <h4 className="text-base text-gray-800">{post.title}</h4>
          {post.media_path && (
            <div onClick={() => setIsImageModalOpen(true)} className="cursor-pointer">
              <img
                src={`http://localhost:5000/uploads/${post.media_path}`}
                alt={post.title}
                className="w-full object-contain rounded mt-2 hover:opacity-80 transition"
              />
            </div>
          )}

          {/* Comment toggle and count */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 mt-3 text-gray-600 hover:text-gray-900"
          >
            <MessageCircle size={18} />
            <span>{commentCount} {commentCount === 1 ? "Comment" : "Comments"}</span>
          </button>

          {showComments && <Comments postId={post.id} userId={userId} />}

          {/* Image Modal with Comments */}
          {isImageModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4">
              <div className="relative bg-white rounded-lg max-w-6xl w-full h-[80vh] flex">
                {/* Image container */}
                <div className="flex-[2] overflow-hidden flex items-center justify-center p-4 bg-gray-100">
                  <img
                    src={`http://localhost:5000/uploads/${post.media_path}`}
                    alt={post.title}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                
                {/* Comments container */}
                <div className="flex-1 flex flex-col border-l border-gray-200">
                  {/* Post header */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      {post.author_pfp ? (
                        <img
                          src={`http://localhost:5000/uploads/${post.author_pfp}`}
                          alt={post.author}
                          className="w-10 h-10 rounded-full border border-gray-300"
                        />
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
                    </div>
                    <p className="mt-3 text-gray-800">{post.title}</p>
                  </div>
                  
                  {/* Scrollable comments section */}
                  <div className="flex-1 overflow-y-auto">
                    <Comments postId={post.id} userId={userId} />
                  </div>
                </div>
                
                {/* Close button */}
                <button
                  onClick={() => setIsImageModalOpen(false)}
                  className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="mt-3 space-y-4">
          <textarea
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded resize-none"
            rows="3"
          />
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Change media (optional):
            </label>
            <input
              type="file"
              onChange={(e) => setEditedMedia(e.target.files[0])}
              className="block w-full text-sm text-gray-500 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {/* Edit Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded transition hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleEditSubmit}
              className={`px-4 py-2 rounded text-white ${
                isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 transition"
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader className="animate-spin w-5 h-5 inline" />
              ) : (
                "Confirm"
              )}
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Deleting */}
      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-lg font-semibold text-gray-800 mb-4">
              Are you sure you want to delete this post?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeletePost}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;