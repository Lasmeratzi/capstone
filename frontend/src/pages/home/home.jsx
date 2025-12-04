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
import CreateModal from "../../components/modals/createmodal"; // ✅ new import

const Home = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [artPosts, setArtPosts] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  // modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isMakePostOpen, setIsMakePostOpen] = useState(false);
  const [isMakeArtOpen, setIsMakeArtOpen] = useState(false);
  const [isMakeAuctionOpen, setIsMakeAuctionOpen] = useState(false);

  const [activeTab, setActiveTab] = useState("artworks");
  const navigate = useNavigate();

  // fetch profile + posts
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
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        const [userRes, postsRes, artRes, accountsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/profile", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/posts", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/artwork-posts", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setUser(userRes.data);
        setPosts(postsRes.data);
        setArtPosts(artRes.data);
        setAccounts(accountsRes.data.filter((a) => a.id !== userRes.data.id));
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

  // delete post
  const handleDelete = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter((p) => p.id !== postId));
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
      <div className="fixed h-screen w-50 bg-white border-r shadow-md">
        <Sidebar onOpenCreate={() => setIsCreateOpen(true)} /> {/* ✅ pass handler */}
      </div>

      {/* Main Content */}
      <div className="ml-[200px] flex-grow max-w-5xl mx-auto min-h-screen px-6 py-6">
        {/* Hero Section */}
        <div className="mb-10">
          <div
            className="rounded-2xl shadow-lg p-10 text-white relative overflow-hidden"
            style={{
              backgroundImage: user.pfp
                ? `url("http://localhost:5000/uploads/${user.pfp}")`
                : "linear-gradient(to right, #6366F1, #8B5CF6, #F9A8D4)",
              backgroundSize: "cover",
              backgroundPosition: "95% 30%",
            }}
          >
            <div className="absolute inset-0 rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/60 via-purple-500/50 to-pink-400/60 mix-blend-multiply"></div>
            </div>

            <div className="relative z-10 max-w-lg">
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user.username}!
              </h1>
              <p className="text-lg">
                Share your thoughts, showcase your art, or join auctions from
                fellow artists.
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="relative mb-6 mt-[-4px]">
          <div className="flex space-x-1">
            {["artworks", "posts", "auctions"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-6 py-2 text-sm font-medium rounded-t-md transition-colors duration-200
                  ${
                    activeTab === tab
                      ? "bg-white shadow-md border-x border-t border-gray-300 text-blue-600 -mb-[2px]"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200 border border-transparent"
                  }`}
                style={{
                  clipPath: "polygon(0 0, 88% 0, 100% 100%, 0% 100%)",
                  zIndex: activeTab === tab ? 10 : 1,
                  minWidth: "fit-content",
                  width: "auto",
                }}
              >
                {tab === "artworks"
                  ? "Artworks"
                  : tab === "posts"
                  ? "Posts"
                  : "Auctions"}
              </button>
            ))}
          </div>
          <div className="h-[2px] bg-gray-300 w-full absolute top-full left-0 z-0" />
        </div>

        {/* Content */}
        {activeTab === "artworks" && (
          <div className="columns-1 md:columns-2 gap-4">
            <ArtPosts />
          </div>
        )}

        {activeTab === "posts" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {errorMessage && (
              <p className="col-span-2 text-red-500 text-center">
                {errorMessage}
              </p>
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
              <p className="col-span-2 text-gray-500 text-center">
                No posts available.
              </p>
            )}
          </div>
        )}

        {activeTab === "auctions" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Auctions />
          </div>
        )}
      </div>

      {/* Right Sidebar */}
      <RSideHome user={user} accounts={accounts} />

      {/* ✅ Create Modal */}
      {isCreateOpen && (
        <CreateModal
          onClose={() => setIsCreateOpen(false)}
          onSelect={(type) => {
            setIsCreateOpen(false); // close create modal first
            if (type === "post") {
              setIsMakePostOpen(true);
            } else if (type === "art") {
              setIsMakeArtOpen(true);
            } else if (type === "auction") {
              setIsMakeAuctionOpen(true);
            }
          }}
        />
      )}

      {/* ✅ Modals for Post, Art, Auction */}
      {isMakePostOpen && (
        <MakePost onClose={() => setIsMakePostOpen(false)} />
      )}
      {isMakeArtOpen && (
        <MakeArt onClose={() => setIsMakeArtOpen(false)} />
      )}
      {isMakeAuctionOpen && (
        <MakeAuction onClose={() => setIsMakeAuctionOpen(false)} />
      )}
    </div>
  );
};

export default Home;
