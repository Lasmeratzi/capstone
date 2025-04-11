import React, { useEffect, useState } from "react";
import axios from "axios";

const Posts = () => {
  const [posts, setPosts] = useState([]); // State to store posts
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch posts from the backend
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/posts"); // Fetch posts
        setPosts(response.data); // Store the fetched posts
        setLoading(false); // Loading complete
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false); // Stop loading on error
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="posts-container bg-gray-100 min-h-screen px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">Posts Feed</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading posts...</p>
      ) : (
        <div className="flex flex-col items-center space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="post-card w-full max-w-2xl bg-white rounded-lg shadow-md p-4 transition hover:shadow-lg"
            >
              {/* Author Section */}
              <div className="flex items-center mb-4">
                <img
                  src={post.author_profile_picture || "/default-profile.png"}
                  alt="Author Profile"
                  className="w-10 h-10 rounded-full mr-3 border"
                />
                <div>
                  <p className="font-semibold text-gray-800">{post.author_fullname || "Anonymous"}</p>
                  <p className="text-sm text-gray-500">@{post.author_username}</p>
                </div>
              </div>

              {/* Post Content */}
              <p className="text-gray-700 mb-4">{post.content}</p>

              {/* Media File (if available) */}
              {post.media && (
                <div className="media-container mb-4">
                  {post.media.match(/\.(jpg|jpeg|png)$/i) ? (
                    <img
                      src={`http://localhost:5000${post.media}`}
                      alt="Post Media"
                      className="w-full rounded-lg shadow-md"
                    />
                  ) : post.media.match(/\.(mp4|mov)$/i) ? (
                    <video controls className="w-full rounded-lg shadow-md">
                      <source src={`http://localhost:5000${post.media}`} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : null}
                </div>
              )}

              {/* Timestamp */}
              <p className="text-sm text-gray-500 text-right">{new Date(post.created_at).toLocaleString()}</p>
            </div>
          ))}

          {posts.length === 0 && (
            <p className="text-center text-gray-500">No posts to display.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Posts;