import React, { useEffect, useState } from "react";
import axios from "axios";
import Post from "../home/post";

const OwnPost = ({ userId }) => {
  const [userPosts, setUserPosts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
   const fetchUserPosts = async () => {
  try {
    if (!userId) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setErrorMessage("Unauthorized: Please log in.");
      return;
    }

    const response = await axios.get("http://localhost:5000/api/posts/user", {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Normalize posts to always have author_id set to userId
    const normalizedPosts = response.data.map((post) => ({
      ...post,
      author_id: userId, // since they're your own posts
    }));

    setUserPosts(normalizedPosts);
  } catch (error) {
    console.error("Failed to fetch user posts:", error);
    setErrorMessage("Failed to load posts. Please try again.");
  }
};


    fetchUserPosts();
  }, [userId]);


  
  const handleDelete = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserPosts(userPosts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  return (
    <div className="space-y-4">
      {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
      {userPosts.length > 0 ? (
        userPosts.map((post) => (
          <Post key={post.id} post={post} userId={userId} handleDelete={handleDelete} />
        ))
      ) : (
        <p className="text-gray-500 text-center text-sm">No posts available.</p>
      )}
    </div>
  );
};

export default OwnPost;