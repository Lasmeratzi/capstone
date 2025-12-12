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
import CreateModal from "../../components/modals/createmodal";

const Home = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [artworks, setArtworks] = useState([]); // NEW: state for artwork posts
  const [accounts, setAccounts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [isLoadingArtworks, setIsLoadingArtworks] = useState(false); // NEW: loading state for artworks

  // modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isMakePostOpen, setIsMakePostOpen] = useState(false);
  const [isMakeArtOpen, setIsMakeArtOpen] = useState(false);
  const [isMakeAuctionOpen, setIsMakeAuctionOpen] = useState(false);

  const [activeTab, setActiveTab] = useState("artworks");
  const navigate = useNavigate();

  // Function to fetch artwork posts from followed users
  const fetchFollowedArtworks = async () => {
    if (!user) return;
    
    try {
      setIsLoadingArtworks(true);
      const token = localStorage.getItem("token");
      
      // Fetch artwork posts from followed users
      const artworkRes = await axios.get("http://localhost:5000/api/artwork-posts/following", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setArtworks(artworkRes.data || []);
    } catch (error) {
      console.error("Error fetching followed artworks:", error);
      // If endpoint doesn't exist (404), fallback to all artwork posts
      if (error.response?.status === 404) {
        console.log("Following endpoint not found for artworks, falling back to all");
        try {
          const token = localStorage.getItem("token");
          const fallbackRes = await axios.get("http://localhost:5000/api/artwork-posts", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setArtworks(fallbackRes.data || []);
        } catch (fallbackError) {
          console.error("Failed to fetch fallback artworks:", fallbackError);
          setArtworks([]);
        }
      } else {
        setArtworks([]);
      }
    } finally {
      setIsLoadingArtworks(false);
    }
  };

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

        setIsLoadingPosts(true);

        // Fetch user profile and accounts
        const [userRes, accountsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/profile", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setUser(userRes.data);
        setAccounts(accountsRes.data.filter((a) => a.id !== userRes.data.id));

        // Try to fetch posts from followed users
        try {
          const postsRes = await axios.get("http://localhost:5000/api/posts/following", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setPosts(postsRes.data || []);
        } catch (followError) {
          console.error("Error fetching following posts:", followError);
          
          // If endpoint doesn't exist (404), fallback to all posts temporarily
          if (followError.response?.status === 404) {
            console.log("Following endpoint not found, falling back to all posts");
            try {
              const fallbackRes = await axios.get("http://localhost:5000/api/posts", {
                headers: { Authorization: `Bearer ${token}` },
              });
              setPosts(fallbackRes.data || []);
            } catch (fallbackError) {
              console.error("Failed to fetch fallback posts:", fallbackError);
              setPosts([]);
            }
          } else {
            setPosts([]);
          }
        }

      } catch (error) {
        console.error("Failed to fetch data:", error);
        if (error.response?.status === 403) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setErrorMessage("Failed to load data. Please try again.");
        }
      } finally {
        setIsLoadingPosts(false);
      }
    };

    fetchProfileAndPosts();
  }, [navigate]);

  // Fetch artworks when user is loaded and artworks tab is active
  useEffect(() => {
    if (user && activeTab === "artworks") {
      fetchFollowedArtworks();
    }
  }, [user, activeTab]);

  // Fetch artworks when switching to artworks tab
  useEffect(() => {
    if (activeTab === "artworks" && user) {
      fetchFollowedArtworks();
    }
  }, [activeTab]);

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

  // delete artwork post
  const handleDeleteArtwork = async (artworkId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/artwork-posts/${artworkId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setArtworks(artworks.filter((a) => a.id !== artworkId));
    } catch (error) {
      console.error("Failed to delete artwork:", error);
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
        <Sidebar onOpenCreate={() => setIsCreateOpen(true)} />
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
            {isLoadingArtworks ? (
              <div className="col-span-2 text-center py-10">
                <p className="text-gray-500">Loading artworks...</p>
              </div>
            ) : artworks.length > 0 ? (
              // Pass artworks as prop to ArtPosts component
              <ArtPosts 
                initialArtworks={artworks}
                userId={user.id}
                onDeleteArtwork={handleDeleteArtwork}
              />
            ) : (
              <div className="col-span-2 text-center py-10">
                <p className="text-gray-500 text-lg mb-3">
                  No artwork posts from followed artists yet.
                </p>
                <p className="text-gray-400 mb-4">
                  Follow some artists to see their artwork here!
                </p>
                <button
                  onClick={() => navigate("/search")}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  Discover Artists
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "posts" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {errorMessage && (
              <p className="col-span-2 text-red-500 text-center">
                {errorMessage}
              </p>
            )}
            
            {isLoadingPosts ? (
              <div className="col-span-2 text-center py-10">
                <p className="text-gray-500">Loading posts...</p>
              </div>
            ) : posts.length > 0 ? (
              posts.map((post) => (
                <Post
                  key={post.id}
                  post={post}
                  userId={user.id}
                  handleDelete={() => handleDelete(post.id)}
                />
              ))
            ) : (
              <div className="col-span-2 text-center py-10">
                <p className="text-gray-500 text-lg mb-3">
                  No posts from followed artists yet.
                </p>
                <p className="text-gray-400 mb-4">
                  Follow some artists to see their posts here!
                </p>
                <button
                  onClick={() => navigate("/search")}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  Discover Artists
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "auctions" && (
          <div className="space-y-6">
            {errorMessage && (
              <p className="text-red-500 text-center">{errorMessage}</p>
            )}
            <Auctions />
          </div>
        )}
      </div>

      {/* Right Sidebar */}
      <RSideHome user={user} accounts={accounts} />

      {/* Create Modal */}
      {isCreateOpen && (
        <CreateModal
          onClose={() => setIsCreateOpen(false)}
          onSelect={(type) => {
            setIsCreateOpen(false);
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

      {/* Modals for Post, Art, Auction */}
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