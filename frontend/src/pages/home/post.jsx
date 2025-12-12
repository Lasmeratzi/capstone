import React, { useState, useEffect } from "react";
import { MessageCircle, MoreVertical, Loader, Trash, Pencil, X, Globe, Users, Lock, Flag } from "lucide-react";
import axios from "axios";
import Comments from "../comments/comments";
import { CheckIcon } from "@heroicons/react/24/outline";
import PostLikes from "../likes/postlikes";
import { formatDistanceToNow } from "date-fns";
import ReportsModal from "../../components/modals/reportsmodal"; // ADD THIS IMPORT

const VerifiedBadge = () => (
  <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 ml-2">
    <CheckIcon className="w-3 h-3 text-white" />
  </div>
);

const VisibilityBadge = ({ visibility }) => {
  const getVisibilityInfo = () => {
    switch (visibility) {
      case 'public':
        return { icon: <Globe size={14} />, text: 'Public', color: 'text-blue-600', bg: 'bg-blue-50' };
      case 'friends':
        return { icon: <Users size={14} />, text: 'Friends Only', color: 'text-green-600', bg: 'bg-green-50' };
      case 'private':
        return { icon: <Lock size={14} />, text: 'Private', color: 'text-gray-600', bg: 'bg-gray-50' };
      default:
        return { icon: <Globe size={14} />, text: 'Public', color: 'text-blue-600', bg: 'bg-blue-50' };
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

const Post = ({ post, userId, handleDelete }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(post.title);
  const [editedVisibility, setEditedVisibility] = useState(post.visibility || 'private');
  const [editedMedia, setEditedMedia] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  
  // ADD THIS STATE
  const [showReportModal, setShowReportModal] = useState(false);

  // Scroll lock for modals - UPDATE THIS
  useEffect(() => {
    if (confirmDelete || isImageModalOpen || isEditing || showReportModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [confirmDelete, isImageModalOpen, isEditing, showReportModal]); // ADD showReportModal

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
      formData.append("visibility", editedVisibility); // Add visibility
      if (editedMedia) {
        formData.append("media", editedMedia);
      }

      await axios.patch(
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

      {/* Post Header */}
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
              <VisibilityBadge visibility={post.visibility} />
            </div>
            <p className="text-gray-600 text-sm">{post.fullname}</p>
          </div>
        </div>

        {/* UPDATE THIS SECTION: Make menu visible to everyone */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-600 hover:text-gray-900"
          >
            <MoreVertical size={20} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border transform transition-all duration-200">
              {/* Author-only options */}
              {post.author_id === userId && (
                <>
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
                </>
              )}
              
              {/* ADD THIS: Report button for non-authors */}
              {post.author_id !== userId && (
                <button
                  onClick={() => {
                    setShowReportModal(true);
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-left text-orange-500 hover:bg-gray-100 transition"
                >
                  <Flag size={16} />
                  Report Post
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Post Content */}
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

      {/* ✅ Divider before likes/comments */}
      <hr className="my-4 border-gray-200" />

      {/* Likes & Comments with date on the right */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <PostLikes postId={post.id} />
          </div>
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
          >
            <MessageCircle size={18} />
            <span className="text-sm">{commentCount}</span>
          </button>
        </div>

        {/* Date moved to right side */}
        {post.created_at && (
          <p className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
          </p>
        )}
      </div>

      {showComments && <Comments postId={post.id} userId={userId} />}

      {/* ----------------------- */}
      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-gray-900/75 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-gray-200 rounded-xl shadow-2xl p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Edit Post</h3>

            <textarea
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded resize-none focus:ring-2 focus:ring-blue-500 mb-4"
              rows="3"
            />

            {/* Visibility Selector in Edit Modal */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Change Visibility
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setEditedVisibility("public")}
                  className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                    editedVisibility === "public"
                      ? "bg-blue-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Globe size={16} />
                  <div className="text-left">
                    <div className="font-semibold">Public</div>
                    <div className="text-xs opacity-80">Everyone</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setEditedVisibility("friends")}
                  className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                    editedVisibility === "friends"
                      ? "bg-green-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Users size={16} />
                  <div className="text-left">
                    <div className="font-semibold">Friends Only</div>
                    <div className="text-xs opacity-80">Visible to your followers</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setEditedVisibility("private")}
                  className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                    editedVisibility === "private"
                      ? "bg-gray-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Lock size={16} />
                  <div className="text-left">
                    <div className="font-semibold">Private</div>
                    <div className="text-xs opacity-80">Only you</div>
                  </div>
                </button>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm text-gray-700 mb-1">
                Change media (optional):
              </label>
              <input
                type="file"
                onChange={(e) => setEditedMedia(e.target.files[0])}
                className="block w-full text-sm text-gray-500 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsEditing(false)}
                className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                className={`px-5 py-2 rounded-lg text-white font-medium ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader className="animate-spin w-5 h-5 inline" />
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ----------------------- */}

      {/* Delete Confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-gray-900/75 backdrop-blur-md flex items-center justify-center p-4 z-50 transition-all duration-200 ease-in-out">
          <div className="bg-white border border-gray-200 rounded-xl shadow-2xl p-6 w-full max-w-md text-center">
            <p className="text-lg font-medium text-gray-800 mb-6">
              Are you sure you want to delete this post?
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeletePost}
                className="px-5 py-2 rounded-lg border border-red-500 bg-red-500 text-white font-medium hover:bg-red-600 hover:border-red-600 transition"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative bg-white rounded-lg max-w-6xl w-full h-[80vh] flex">
            <div className="flex-[2] overflow-hidden flex items-center justify-center p-4 bg-gray-100">
              <img
                src={`http://localhost:5000/uploads/${post.media_path}`}
                alt={post.title}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="flex-1 flex flex-col border-l border-gray-200">
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
                      <VisibilityBadge visibility={post.visibility} />
                    </div>
                    <p className="text-gray-600 text-sm">{post.fullname}</p>
                  </div>
                </div>
                <p className="mt-3 text-gray-800">{post.title}</p>

                {/* Likes & Comments with date on the right */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <PostLikes postId={post.id} />
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <MessageCircle size={18} />
                      <span className="text-sm">{commentCount}</span>
                    </div>
                  </div>

                  {/* Date in modal - bottom right */}
                  {post.created_at && (
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                <Comments postId={post.id} userId={userId} />
              </div>
            </div>

            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}

      {/* ADD THIS: Report Modal */}
      <ReportsModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        contentType="post"
        contentId={post.id}
        contentAuthorId={post.author_id}
      />
    </div>
  );
};

export default Post;