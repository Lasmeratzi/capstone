import React, { useState, useEffect } from "react";
import axios from "axios";
import { MessageCircle } from "lucide-react";

const Comments = ({ postId, userId }) => {
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
      if (!token) {
        setErrorMessage("Unauthorized: Please log in.");
        return;
      }

      const { data } = await axios.get(
        `http://localhost:5000/api/comments/recent/${postId}?limit=${limit}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComments(data);
      setErrorMessage("");
    } catch {
      setErrorMessage("Failed to load comments.");
    }
  };

  const fetchCommentCount = async () => {
    try {
      if (!token) return;

      const { data } = await axios.get(
        `http://localhost:5000/api/comments/count/${postId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCommentCount(data.count);
    } catch (error) {
      console.error("Failed to fetch comment count.");
    }
  };

  useEffect(() => {
    fetchComments();
    fetchCommentCount();
  }, [postId, limit]);

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
        "http://localhost:5000/api/comments",
        { post_id: postId, comment_text: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCommentText("");
      fetchComments();
      fetchCommentCount();
    } catch {
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

      await axios.put(
        `http://localhost:5000/api/comments/${commentId}`,
        { comment_text: editingText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEditingCommentId(null);
      setEditingText("");
      fetchComments();
      fetchCommentCount();
    } catch {
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
        `http://localhost:5000/api/comments/${commentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchComments();
      fetchCommentCount();
    } catch {
      setErrorMessage("Failed to delete comment.");
    }
  };

  const handleShowMore = () => {
    setLimit((prev) => prev + 3);
  };

  return (
    <div className="mt-4 bg-gray-50 p-5 rounded-xl border border-gray-200">
      <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2 text-base">
        <MessageCircle size={18} /> Comments ({commentCount})
      </h4>

      {errorMessage && (
        <p className="text-red-500 text-sm mb-3">{errorMessage}</p>
      )}

      <div className="space-y-4">
        {comments.length ? (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="flex items-start gap-3 border border-gray-200 p-3 rounded-2xl bg-white"
            >
              {comment.author_pfp ? (
                <img
                  src={`http://localhost:5000/uploads/${comment.author_pfp}`}
                  alt={comment.author}
                  className="w-9 h-9 rounded-full object-cover border"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-xs text-gray-600">
                  N/A
                </div>
              )}

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm text-gray-800">
                    {comment.author}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {comment.created_at
                      ? new Date(comment.created_at).toLocaleString()
                      : "Just now"}
                  </p>
                </div>

                {editingCommentId === comment.id ? (
                  <textarea
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md text-sm"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    rows={3}
                  />
                ) : (
                  <p className="text-gray-700 text-sm mt-1">
                    {comment.comment_text}
                  </p>
                )}

                {userId === comment.author_id && (
                  <div className="mt-2 flex gap-2">
                    {editingCommentId === comment.id ? (
                      <>
                        <button
                          onClick={() => handleSaveEdit(comment.id)}
                          className="text-green-600 text-xs font-semibold hover:underline"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-gray-500 text-xs font-semibold hover:underline"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditClick(comment)}
                          className="text-blue-600 text-xs font-semibold hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(comment.id)}
                          className="text-red-600 text-xs font-semibold hover:underline"
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
          <p className="text-gray-500 text-sm">No comments yet.</p>
        )}
      </div>

      {comments.length >= limit && (
        <button
          onClick={handleShowMore}
          className="mt-4 text-sm text-blue-600 hover:underline font-medium"
        >
          Show more comments
        </button>
      )}

      {userId && (
        <form onSubmit={handleSubmit} className="mt-5 flex items-center gap-2">
          <input
            type="text"
            className="flex-1 p-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-300 focus:outline-none transition text-sm"
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-5 py-2 rounded-full hover:bg-blue-600 transition-all text-sm font-medium"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Posting..." : "Post"}
          </button>
        </form>
      )}
    </div>
  );
};

export default Comments;
