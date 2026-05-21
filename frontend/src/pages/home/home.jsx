import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../sidebar/sidebar";
import { motion } from "framer-motion";
import MakePost from "../makepost/makepost";
import MakeArt from "../makepost/makeart";
import MakeAuction from "../makepost/makeauction";
import Post from "../home/post";
import ArtPosts from "../home/artpost";
import Auctions from "../home/auctions";
import RSideHome from "../home/rsidehome";
import CreateModal from "../../components/modals/createmodal";
import MobileNav from "../../components/layout/MobileNav";

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

  // Function to fetch artwork posts (public + followed friends + own private)
  const fetchArtworkPosts = async () => {
    if (!user) return;
    
    try {
      setIsLoadingArtworks(true);
      const token = localStorage.getItem("token");
      
      // Fetch all artwork posts visible to user
      const artworkRes = await axios.get("http://localhost:5000/api/artwork-posts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setArtworks(artworkRes.data || []);
    } catch (error) {
      console.error("Error fetching artwork posts:", error);
      setArtworks([]);
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

        // Fetch all posts visible to user (public + followed friends + own private)
        try {
          const postsRes = await axios.get("http://localhost:5000/api/posts", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setPosts(postsRes.data || []);
        } catch (postsError) {
          console.error("Error fetching posts:", postsError);
          setPosts([]);
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
      fetchArtworkPosts();
    }
  }, [user, activeTab]);

  // Fetch artworks when switching to artworks tab
  useEffect(() => {
    if (activeTab === "artworks" && user) {
      fetchArtworkPosts();
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

  const handleSwitchToAuctions = () => {
  setActiveTab('auctions');
  // Optional: scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
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
    <div className="flex bg-white dark:bg-[#0A0A0B] transition-colors duration-300">
      {/* Mobile Navigation */}
      <MobileNav onOpenCreate={() => setIsCreateOpen(true)} />

      {/* Sidebar — hidden on mobile */}
      <div className="hidden md:block fixed top-0 left-0 h-screen w-[200px] z-40">
        <Sidebar onOpenCreate={() => setIsCreateOpen(true)} />
      </div>

      {/* Main Content & Right Sidebar Container */}
      <div className="ml-0 md:ml-[200px] flex-grow flex min-h-screen border-l border-transparent md:border-gray-100 dark:md:border-gray-800/50">
        {/* Center Feed */}
        <div className="flex-grow px-4 md:px-8 pb-20 md:pb-10 pt-16 md:pt-0">
          {/* Content Tabs - Centered Gallery Style */}
          <div className="pt-10">
            {/* Tabs Container - Centered */}
            <div className="flex flex-col items-center mb-10">
              <div className="flex items-center gap-12">
                {[
                  { key: "artworks", label: "Artworks" },
                  { key: "posts", label: "Posts" },
                  { key: "auctions", label: "Auctions" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`relative pb-2 text-base font-bold tracking-tight transition-all duration-300 cursor-pointer ${
                      activeTab === tab.key
                        ? "text-gray-900 dark:text-gray-100"
                        : "text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400"
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.key && (
                      <motion.div 
                        layoutId="activeTab"
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-[#5E66FF] rounded-full"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

        {/* Content Feed */}
        <div>
          {activeTab === "artworks" && (
            <div>
              {isLoadingArtworks ? (
                <div className="text-center py-20">
                  <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-400 font-medium text-sm">Loading artworks...</p>
                </div>
              ) : artworks.length > 0 ? (
                <ArtPosts 
                  initialArtworks={artworks}
                  userId={user.id}
                  onDeleteArtwork={handleDeleteArtwork}
                />
              ) : (
                <div className="text-center py-16">
                  <p className="text-gray-400 text-sm font-medium mb-1">No artworks yet</p>
                  <p className="text-gray-300 text-xs mb-5">Be the first to share your creativity.</p>
                  <button
                    onClick={() => navigate("/search")}
                    className="px-5 py-2 bg-gray-900 text-white text-xs font-semibold rounded-lg hover:bg-gray-800 transition cursor-pointer"
                  >
                    Discover Artists
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "posts" && (
            <div className="w-full">
              {isLoadingPosts ? (
                <div className="w-full text-center py-20">
                  <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-400 font-medium text-sm">Loading feed...</p>
                </div>
              ) : posts.length > 0 ? (
                <>
                  {/* Mobile/Tablet view: Single Column (chronological) */}
                  <div className="flex flex-col gap-8 md:hidden">
                    {posts.map((post) => (
                      <Post
                        key={post.id}
                        post={post}
                        userId={user.id}
                        handleDelete={() => handleDelete(post.id)}
                      />
                    ))}
                  </div>

                  {/* Desktop view: Two Columns */}
                  <div className="hidden md:flex gap-8 items-start">
                    {/* Left Column */}
                    <div className="flex-1 flex flex-col gap-8">
                      {posts.filter((_, i) => i % 2 === 0).map((post) => (
                        <Post
                          key={post.id}
                          post={post}
                          userId={user.id}
                          handleDelete={() => handleDelete(post.id)}
                        />
                      ))}
                    </div>
                    {/* Right Column */}
                    <div className="flex-1 flex flex-col gap-8">
                      {posts.filter((_, i) => i % 2 !== 0).map((post) => (
                        <Post
                          key={post.id}
                          post={post}
                          userId={user.id}
                          handleDelete={() => handleDelete(post.id)}
                        />
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full text-center py-16">
                  <p className="text-gray-400 text-sm font-medium mb-1">Your feed is empty</p>
                  <p className="text-gray-300 text-xs mb-5">Follow other users to see their updates.</p>
                  <button
                    onClick={() => navigate("/search")}
                    className="px-5 py-2 bg-gray-900 text-white text-xs font-semibold rounded-lg hover:bg-gray-800 transition cursor-pointer"
                  >
                    Find People
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "auctions" && (
            <div>
              {errorMessage && (
                <p className="text-red-500 text-center text-sm mb-4">{errorMessage}</p>
              )}
              <Auctions />
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar - Hidden on mobile/tablet */}
      <div className="hidden lg:block w-[320px] flex-shrink-0 bg-white dark:bg-[#0A0A0B] min-h-screen transition-colors duration-300">
        <RSideHome 
          user={user} 
          accounts={accounts} 
          onSwitchToAuctions={handleSwitchToAuctions}
        />
      </div>
      </div>

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