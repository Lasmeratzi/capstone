import React, { useEffect, useState } from "react";
import axios from "axios";

axios.defaults.baseURL = 'http://localhost:5000';

const FollowButton = ({ targetUserId, onFollowChange }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkFollowingStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`/api/follow/status/${targetUserId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsFollowing(res.data.isFollowing);
    } catch (error) {
      console.error("Error checking follow status:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkFollowingStatus();
  }, [targetUserId]);

 const handleFollowToggle = async () => {
  try {
    const token = localStorage.getItem("token");

    if (isFollowing) {
      await axios.post("/api/follow/unfollow",
        { targetUserId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } else {
      await axios.post("/api/follow/follow",
        { targetUserId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }

    setIsFollowing(!isFollowing);
    if (onFollowChange) onFollowChange();
  } catch (error) {
    console.error("Error toggling follow status:", error);
  }
};

  const [isHovered, setIsHovered] = useState(false);

  if (loading) return null;

  return (
    <button
      onClick={handleFollowToggle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border cursor-pointer ${
        isFollowing
          ? isHovered
            ? "bg-red-500/20 text-red-400 border-red-400/50"
            : "bg-white/10 text-white border-white/30"
          : "bg-[#5E66FF] hover:bg-[#4D5BFF] text-white border-transparent hover:shadow-lg hover:shadow-indigo-500/20"
      }`}
    >
      {isFollowing ? (isHovered ? "Unfollow" : "Following") : "Follow"}
    </button>
  );
};

export default FollowButton;
