import React, { useState, useEffect } from "react";
import axios from "axios";
import { MessageCircle } from "lucide-react";

const Comments = ({ postId, userId }) => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const fetchComments = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMessage("Unauthorized: Please log in.");
        return;
      }

      const response = await axios.get(`http://localhost:5000/api/comments/recent/${postId}?limit=3`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(response.data);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Failed to load comments.");
    }
  };

  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments, postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const token = localStorage.getItem("token");
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
    } catch (error) {
      setErrorMessage("Failed to post comment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-4">
      {/* Toggle Button */}
      <button
        onClick={() => setShowComments(!showComments)}
        className="flex items-center gap-1 mx-auto text-gray-600 hover:text-gray-800 transition text-sm"
      >
        <MessageCircle size={18} /> {showComments ? "Hide Comments" : "Show Comments"}
      </button>

      {showComments && (
        <div className="mt-3 bg-gray-50 p-4 rounded-lg shadow-md">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-1">
            <MessageCircle size={18} /> Recent Comments
          </h4>

          {errorMessage && <p className="text-red-500">{errorMessage}</p>}

          <div className="space-y-3">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-3 bg-white p-3 rounded-lg shadow">
                  {comment.author_pfp ? (
                    <img
                      src={`http://localhost:5000/uploads/${comment.author_pfp}`}
                      alt={comment.author}
                      className="w-8 h-8 rounded-full border border-gray-300"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-600 text-xs">N/A</span>
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{comment.author}</p>
                    <p className="text-gray-700">{comment.comment_text}</p>
                    <p className="text-gray-400 text-xs">{new Date(comment.created_at).toLocaleString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No comments yet.</p>
            )}
          </div>

          {userId && (
            <form onSubmit={handleSubmit} className="mt-4">
              <textarea
                className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-200 transition-all"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              ></textarea>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all mt-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Post Comment"}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default Comments;
