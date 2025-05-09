import React, { useEffect, useState } from "react";
import axios from "axios";
import Post from "../home/post"; // Reuse Post component for displaying posts

const VisitPost = ({ userId }) => {
  const [userPosts, setUserPosts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        if (!userId) return; // Ensure userId is defined

        const token = localStorage.getItem("token");
        if (!token) {
          setErrorMessage("Unauthorized: Please log in.");
          return;
        }

        // API call to fetch posts for the visited user
        const response = await axios.get(`http://localhost:5000/api/posts?author_id=${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserPosts(response.data);
      } catch (error) {
        console.error("Failed to fetch user posts:", error);
        setErrorMessage("Failed to load posts. Please try again.");
      }
    };

    fetchUserPosts();
  }, [userId]);

  return (
    <div className="space-y-4">
      {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
      {userPosts.length > 0 ? (
        userPosts.map((post) => <Post key={post.id} post={post} userId={userId} />)
      ) : (
        <p className="text-gray-500 text-center text-sm">No posts available.</p>
      )}
    </div>
  );
};

export default VisitPost;