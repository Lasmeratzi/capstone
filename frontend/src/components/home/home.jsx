import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../sidebar/sidebar";
import MakePost from "../makepost/makepost";
import Post from "../home/post";
import { motion } from "framer-motion";

const Home = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isMakePostOpen, setIsMakePostOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setErrorMessage("Unauthorized: Please log in.");
          navigate("/login");
          return;
        }

        const payload = JSON.parse(atob(token.split(".")[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < currentTime) {
          console.error("Token expired. Redirecting...");
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        const userResponse = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userResponse.data);

        const postsResponse = await axios.get("http://localhost:5000/api/posts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(postsResponse.data);

        const accountsResponse = await axios.get("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAccounts(accountsResponse.data.filter((account) => account.id !== userResponse.data.id));
      } catch (error) {
        console.error("Failed to fetch data:", error);
        if (error.response?.status === 403) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setErrorMessage("Failed to load data. Please try again.");
        }
      }
    };

    fetchProfileAndPosts();
  }, []);

  const toggleMakePostModal = () => {
    setIsMakePostOpen(!isMakePostOpen);
  };

  const closeMakePostModal = (e) => {
    if (e.target.id === "makePostModal") {
      setIsMakePostOpen(false);
    }
  };

  const handleDelete = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="fixed h-screen w-60 bg-white border-r shadow-md">
        <Sidebar />
      </div>

      {/* Main Feed */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="ml-[350px] flex-grow max-w-2xl mx-auto min-h-screen bg-white"
      >
        {/* Top Tabs */}
        <div className="flex border-b border-gray-300">
          <button
            className="flex-1 text-center py-4 font-semibold text-lg hover:bg-gray-100 transition border-b-4 border-blue-500 text-blue-600"
          >
            Posts
          </button>
          <button
            className="flex-1 text-center py-4 font-semibold text-lg hover:bg-gray-100 transition text-gray-600"
          >
            Bids
          </button>
        </div>

        {/* Make a Post Prompt */}
        <div className="p-4 border-b mb-4 border-gray-300 flex justify-between items-center">
          <p className="text-gray-700 font-medium text-lg">Want to share something?</p>
          <button
            onClick={toggleMakePostModal}
            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded shadow hover:bg-blue-600 text-sm"
          >
            Make a post
          </button>
        </div>

        {/* Posts Feed */}
        <div className="flex flex-col">
          {errorMessage && (
            <p className="text-red-500 p-4 text-center">{errorMessage}</p>
          )}

          {posts.length > 0 ? (
            posts.map((post) => (
              <Post
                key={post.id}
                post={post}
                userId={user.id}
                handleDelete={() => handleDelete(post.id)}
              />
            ))
          ) : (
            <p className="text-gray-500 text-sm text-center p-6">
              No posts available.
            </p>
          )}  
        </div>
      </motion.div>

      {/* Right Sidebar */}
      <div className="w-95 py-6 pr-40">
        {/* Logged In User */}
        <div
          className="flex items-center mb-6 cursor-pointer"
          onClick={() => navigate("/profile")}
        >
          {user.pfp ? (
            <img
              src={`http://localhost:5000/uploads/${user.pfp}`}
              alt="Profile"
              className="w-12 h-12 rounded-full border border-gray-300"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-gray-600 text-sm">N/A</span>
            </div>
          )}
          <div className="ml-3">
            <p className="font-bold text-gray-800">{user.username}</p>
            <p className="text-gray-600 text-sm">{user.fullname}</p>
          </div>
        </div>

        {/* Recent Users */}
        <div>
          <h3 className="text-gray-700 font-semibold mb-3">Follow other artists</h3>
          <div className="space-y-3">
            {accounts.slice(0, 3).map((account) => (
              <div
                key={account.id}
                className="flex items-center bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition"
              >
                <img
                  src={`http://localhost:5000/uploads/${account.pfp || "default.png"}`}
                  alt={account.username}
                  className="w-10 h-10 rounded-full border"
                />
                <div className="ml-3">
                  <p className="font-medium text-gray-800">{account.username}</p>
                  <p className="text-gray-500 text-sm">{account.fullname}</p>
                </div>
              </div>
            ))}
            {accounts.length === 0 && (
              <p className="text-gray-500 text-sm">No other users available.</p>
            )}
          </div>
        </div>
      </div>

      {/* MakePost Modal */}
      {isMakePostOpen && (
        <div
          id="makePostModal"
          onClick={closeMakePostModal}
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
            <button
              onClick={toggleMakePostModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
            >
              &times;
            </button>

            <MakePost onSuccess={toggleMakePostModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
