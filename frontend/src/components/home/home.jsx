import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../sidebar/sidebar";
import MakePost from "../makepost/makepost";
import Post from "../home/post";

const Home = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [accounts, setAccounts] = useState([]); // State for registered accounts
  const [errorMessage, setErrorMessage] = useState("");
  const [isMakePostOpen, setIsMakePostOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setErrorMessage("Unauthorized: Please log in.");
          return;
        }

        // Fetch logged-in user profile
        const userResponse = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userResponse.data);

        // Fetch posts
        const postsResponse = await axios.get("http://localhost:5000/api/posts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(postsResponse.data);

        // Fetch registered accounts
        const accountsResponse = await axios.get("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Exclude the logged-in user from the accounts list
        setAccounts(accountsResponse.data.filter((account) => account.id !== userResponse.data.id));
      } catch (error) {
        console.error("Failed to fetch profile, posts, or accounts:", error);
        setErrorMessage("Failed to load data. Please try again.");
      }
    };

    fetchProfileAndPosts();
  }, []);

  const handleDelete = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMessage("Unauthorized: Please log in.");
        return;
      }

      await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPosts(posts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Failed to delete post:", error);
      setErrorMessage(
        error.response?.data?.message || "Failed to delete post. Please try again."
      );
    }
  };

  const toggleMakePostModal = () => {
    setIsMakePostOpen(!isMakePostOpen);
  };

  const refreshPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/posts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(response.data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
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

      {/* Main Content */}
      <div className="ml-60 flex-grow bg-gray-200 p-4">
        {/* Header Section */}
        <div className="flex justify-between items-center bg-white shadow-md rounded-lg p-4">
          {/* Make a post button */}
          <button
            onClick={toggleMakePostModal}
            className="flex items-center px-4 py-2 bg-blue-500 text-white font-semibold rounded shadow hover:bg-blue-600 text-sm"
          >
            <span>Make a post</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-4 h-4 ml-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 3.487c.451-.452 1.181-.452 1.632 0l2.019 2.019c.451.452.451 1.181 0 1.632l-10.123 10.123a4.5 4.5 0 01-1.246.865l-4.035 1.903a.75.75 0 01-.976-.976l1.903-4.035a4.5 4.5 0 01.865-1.246l10.123-10.123zM19.5 5.25L17.25 3M6.75 18.75l-1.5-1.5"
              />
            </svg>
          </button>

          {/* User Profile Section */}
          <div className="flex items-center">
            {user.pfp ? (
              <img
                src={`http://localhost:5000/uploads/${user.pfp}`}
                alt="Profile"
                className="w-10 h-10 rounded-full border border-gray-300 cursor-pointer"
                onClick={() => navigate("/profile")}
              />
            ) : (
              <div
                className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer"
                onClick={() => navigate("/profile")}
              >
                <span className="text-gray-600 text-sm">N/A</span>
              </div>
            )}
            <div className="ml-3">
              <span className="text-gray-800 font-semibold text-sm">{user.username}</span>
              <p className="text-gray-600 text-xs">{user.fullname}</p>
            </div>
          </div>
        </div>

        {/* Main Content Wrapper */}
        <div className="flex mt-4 space-x-4">
          {/* Posts Section */}
          <div className="flex-grow space-y-4">
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            {posts.length > 0 ? (
              posts.map((post) => (
                <Post
                  key={post.id}
                  post={post}
                  userId={user.id}
                  handleDelete={handleDelete}
                />
              ))
            ) : (
              <p className="text-gray-500 text-sm text-center">No posts available.</p>
            )}
          </div>

          {/* Registered Accounts Section */}
          <div className="flex flex-col space-y-4">
            {accounts.length > 0 ? (
              accounts.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center space-x-3 bg-white shadow-md rounded-lg p-4"
                >
                  <img
                    src={`http://localhost:5000/uploads/${account.pfp || "default.png"}`}
                    alt={account.username}
                    className="w-10 h-10 rounded-full border"
                  />
                  <div>
                    <p className="font-medium text-gray-800">{account.username}</p>
                    <p className="text-gray-500 text-sm">{account.fullname}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No other accounts available.</p>
            )}
          </div>
        </div>

        {/* Make a Post Modal */}
        {isMakePostOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-lg relative">
              <button
                onClick={toggleMakePostModal}
                className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-lg"
              >
                &times;
              </button>
              <MakePost
                onSuccess={() => {
                  toggleMakePostModal();
                  refreshPosts();
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
