import React, { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";

const API_BASE = "http://localhost:5000";

const ArtworkComments = ({ artworkPostId, userId }) => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [limit, setLimit] = useState(3);
  const [commentCount, setCommentCount] = useState(0);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const token = localStorage.getItem("token");

  const fetchComments = async () => {
    try {
      if (!token) return;

      const { data } = await axios.get(
        `${API_BASE}/api/artwork-comments/recent/${artworkPostId}?limit=${limit}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComments(data);
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to load comments.");
    }
  };

  const fetchCommentCount = async () => {
    try {
      if (!token) return;

      const { data } = await axios.get(
        `${API_BASE}/api/artwork-comments/count/${artworkPostId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCommentCount(data.count ?? 0);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchComments();
    fetchCommentCount();
  }, [artworkPostId, limit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      if (!token) {
        setErrorMessage("Unauthorized: Please log in.");
        setIsSubmitting(false);
        return;
      }

      await axios.post(
        `${API_BASE}/api/artwork-comments`,
        { artwork_post_id: artworkPostId, comment_text: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCommentText("");
      fetchComments();
      fetchCommentCount();
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to post comment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (comment) => {
    setEditingCommentId(comment.id);
    setEditingText(comment.comment_text);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingText("");
  };

  const handleSaveEdit = async (commentId) => {
    if (!editingText.trim()) {
      setErrorMessage("Comment cannot be empty.");
      return;
    }

    try {
      if (!token) {
        setErrorMessage("Unauthorized: Please log in.");
        return;
      }

      await axios.patch(
        `${API_BASE}/api/artwork-comments/${commentId}`,
        { comment_text: editingText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEditingCommentId(null);
      setEditingText("");
      fetchComments();
      fetchCommentCount();
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to update comment.");
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    try {
      if (!token) {
        setErrorMessage("Unauthorized: Please log in.");
        return;
      }

      await axios.delete(
        `${API_BASE}/api/artwork-comments/${commentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchComments();
      fetchCommentCount();
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to delete comment.");
    }
  };

  const handleShowMore = () => {
    setLimit((prev) => prev + 3);
  };

  return (
    <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
      <div className="flex items-center gap-2 mb-3">
        <MessageCircle size={16} />
        <span className="text-sm font-semibold">Comments ({commentCount})</span>
      </div>

      {errorMessage && (
        <p className="text-red-500 text-sm mb-2">{errorMessage}</p>
      )}

      {comments.length ? (
        comments.map((comment) => (
          <div
            key={comment.id}
            className="flex items-start gap-3 mb-3 border-b border-gray-200 pb-3"
          >
            {comment.author_pfp ? (
              <img
                src={`${API_BASE}/uploads/${comment.author_pfp}`}
                alt={comment.author}
                className="w-8 h-8 rounded-full object-cover border"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs text-gray-600">
                N/A
              </div>
            )}

            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="font-medium text-sm">{comment.author}</span>
                <span className="text-xs text-gray-500">
                  {comment.created_at
                    ? formatDistanceToNow(new Date(comment.created_at), {
                        addSuffix: true,
                      })
                    : "Just now"}
                </span>
              </div>

              {editingCommentId === comment.id ? (
                <textarea
                  className="w-full mt-1 p-2 border border-gray-300 rounded text-sm"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  rows={2}
                />
              ) : (
                <p className="text-gray-700 text-sm mt-1">
                  {comment.comment_text}
                </p>
              )}

              {String(userId) === String(comment.author_id) && (
                <div className="mt-2 flex gap-2 text-xs">
                  {editingCommentId === comment.id ? (
                    <>
                      <button
                        onClick={() => handleSaveEdit(comment.id)}
                        className="text-green-600 font-semibold hover:underline"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="text-gray-500 font-semibold hover:underline"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditClick(comment)}
                        className="text-blue-600 font-semibold hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="text-red-600 font-semibold hover:underline"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500">No comments yet.</p>
      )}

      {comments.length >= limit && (
        <button
          onClick={handleShowMore}
          className="text-sm text-blue-600 hover:underline mt-2"
        >
          Show more comments
        </button>
      )}

      {userId && (
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 mt-3 border-t border-gray-200 pt-3"
        >
          <input
            type="text"
            className="flex-1 p-2 border border-gray-300 rounded-full text-sm focus:ring-1 focus:ring-blue-300"
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button
            type="submit"
            className="px-4 py-1 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Posting..." : "Post"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ArtworkComments;
