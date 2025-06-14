import React, { useEffect, useState } from "react";
import axios from "axios";

axios.defaults.baseURL = 'http://localhost:5000';

const FollowButton = ({ targetUserId }) => {
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
  } catch (error) {
    console.error("Error toggling follow status:", error);
  }
};

  if (loading) return null;

  return (
    <button
      onClick={handleFollowToggle}
      className={`px-4 py-2 rounded ${
        isFollowing ? "bg-gray-400 text-white" : "bg-blue-500 text-white"
      }`}
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
};

export default FollowButton;
