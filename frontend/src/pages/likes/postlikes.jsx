import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import axios from "axios";

const PostLikes = ({ postId }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const token = localStorage.getItem("token");

  const fetchLikeCount = async () => {
    try {
      if (!token) return;

      const response = await axios.get(
        `http://localhost:5000/api/posts/${postId}/likes`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLikeCount(response.data.likeCount);
    } catch (error) {
      console.error("Failed to fetch like count", error);
    }
  };

  const fetchUserLikeStatus = async () => {
    try {
      if (!token) return;

      const response = await axios.get(
        `http://localhost:5000/api/posts/${postId}/liked`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLiked(response.data.liked);
    } catch (error) {
      console.error("Failed to fetch like status", error);
    }
  };

  const toggleLike = async () => {
    try {
      if (!token) return;

      if (liked) {
        await axios.delete(`http://localhost:5000/api/posts/${postId}/unlike`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLikeCount((prev) => prev - 1);
        setLiked(false);
      } else {
        await axios.post(
          `http://localhost:5000/api/posts/${postId}/like`,
          null,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLikeCount((prev) => prev + 1);
        setLiked(true);
      }
    } catch (error) {
      console.error("Failed to toggle like", error);
    }
  };

  useEffect(() => {
    fetchLikeCount();
    fetchUserLikeStatus();
  }, [postId]);

  return (
    <button
      onClick={toggleLike}
      className="flex items-center gap-2 transition group"
    >
      <Heart
        size={20}
        className={`transition ${
          liked
            ? "text-purple-600 fill-purple-600"
            : "text-gray-500 group-hover:text-black"
        }`}
        fill={liked ? "currentColor" : "none"}
      />

      <span
        className={`transition ${
          liked ? "text-purple-600 font-medium" : "text-gray-600 group-hover:text-black"
        }`}
      >
        {likeCount}
      </span>
    </button>
  );
};

export default PostLikes;
