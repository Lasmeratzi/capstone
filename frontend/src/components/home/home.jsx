import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../sidebar/sidebar";
import MakePost from "../makepost/makepost";
import MakeArt from "../makepost/makeart";
import MakeAuction from "../makepost/makeauction";
import Post from "../home/post";
import ArtPosts from "../home/artpost";
import Auctions from "../home/auctions";
import RSideHome from "../home/rsidehome";
import { motion } from "framer-motion";

const ArtPostCard = ({ post }) => {
  return (
    <div
      key={post.id}
      className="border border-gray-300 rounded p-4 mb-4 shadow-sm bg-white"
    >
      <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
      <div className="flex overflow-x-auto space-x-2 mb-3">
        {post.media?.map((mediaItem) => (
          <img
            key={mediaItem.id}
            src={`http://localhost:5000/${mediaItem.file_path}`}
            alt={post.title}
            className="h-40 object-cover rounded"
          />
        ))}
      </div>
      <p className="text-sm text-gray-600 mb-1">
        By: {post.author?.username || "Unknown"}
      </p>
      <p className="text-xs text-gray-500">
        {new Date(post.created_at).toLocaleString()}
      </p>
    </div>
  );
};

const Home = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [artPosts, setArtPosts] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isMakePostOpen, setIsMakePostOpen] = useState(false);
  const [isMakeArtOpen, setIsMakeArtOpen] = useState(false);
  const [isMakeAuctionOpen, setIsMakeAuctionOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");

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

        const artPostsResponse = await axios.get("http://localhost:5000/api/artwork-posts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setArtPosts(artPostsResponse.data);

        const accountsResponse = await axios.get("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAccounts(
          accountsResponse.data.filter(
            (account) => account.id !== userResponse.data.id
          )
        );
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
  }, [navigate]);

  const toggleMakePostModal = () => {
    setIsMakePostOpen(!isMakePostOpen);
  };

  const toggleMakeArtModal = () => {
    setIsMakeArtOpen(!isMakeArtOpen);
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
            onClick={() => setActiveTab("posts")}
            className={`flex-1 text-center py-4 font-semibold text-lg hover:bg-gray-100 transition ${
              activeTab === "posts"
                ? "border-b-4 border-blue-500 text-blue-600"
                : "text-gray-600"
            }`}
          >
            Posts
          </button>
          <button
            onClick={() => setActiveTab("auctions")}
            className={`flex-1 text-center py-4 font-semibold text-lg hover:bg-gray-100 transition ${
              activeTab === "auctions"
                ? "border-b-4 border-blue-500 text-blue-600"
                : "text-gray-600"
            }`}
          >
            Auctions
          </button>
        </div>

        {/* Top Buttons */}
        <div className="p-4 border-b mb-4 border-gray-300 flex justify-between items-center">
          {activeTab === "posts" && (
            <>
              <p className="text-gray-700 font-medium text-lg">
                Want to share something?
              </p>
              <div className="space-x-2">
                <button
                  onClick={toggleMakePostModal}
                  className="px-4 py-2 bg-blue-500 text-white font-semibold rounded shadow hover:bg-blue-600 text-sm"
                >
                  Make a post
                </button>
                <button
                  onClick={toggleMakeArtModal}
                  className="px-4 py-2 bg-green-600 text-white font-semibold rounded shadow hover:bg-green-700 text-sm"
                >
                  Share artwork
                </button>
              </div>
            </>
          )}

          {activeTab === "auctions" && (
            <>
              <p className="text-gray-700 font-medium text-lg">
                Want to auction something?
              </p>
              <div className="space-x-2">
                <button
                  onClick={() => setIsMakeAuctionOpen(true)}
                  className="px-4 py-2 bg-purple-600 text-white font-semibold rounded shadow hover:bg-purple-700 text-sm"
                >
                  Make an auction
                </button>
              </div>
            </>
          )}
        </div>

        {/* Main Content */}
        <div className="flex flex-col">
          {activeTab === "posts" && (
            <>
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

              <div className="mt-6">
                <ArtPosts />
              </div>
            </>
          )}

          {activeTab === "auctions" && (
            <div className="mt-4">
              <Auctions />
            </div>
          )}
        </div>
      </motion.div>

      {/* Right Sidebar */}
      <RSideHome user={user} accounts={accounts} />

      {/* Modals */}
      {isMakePostOpen && (
        <div
          id="makePostModal"
          onClick={(e) => {
            if (e.target.id === "makePostModal") setIsMakePostOpen(false);
          }}
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

      {isMakeArtOpen && (
        <div
          id="makeArtModal"
          onClick={(e) => {
            if (e.target.id === "makeArtModal") setIsMakeArtOpen(false);
          }}
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
            <button
              onClick={toggleMakeArtModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
            >
              &times;
            </button>
            <MakeArt />
          </div>
        </div>
      )}

      {isMakeAuctionOpen && (
        <div
          id="makeAuctionModal"
          onClick={(e) => {
            if (e.target.id === "makeAuctionModal") setIsMakeAuctionOpen(false);
          }}
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
            <button
              onClick={() => setIsMakeAuctionOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
            >
              &times;
            </button>
            <MakeAuction onSuccess={() => setIsMakeAuctionOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
