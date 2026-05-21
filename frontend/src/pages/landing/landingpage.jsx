import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageCircle,
  Tag,
  Sparkles,
  Palette,
} from "lucide-react";
import { CheckIcon } from "@heroicons/react/24/outline";
import { formatDistanceToNow } from "date-fns";

const API_BASE = "http://localhost:5000";

const VerifiedBadge = () => (
  <div className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-500 ml-1">
    <CheckIcon className="w-2.5 h-2.5 text-white" />
  </div>
);

const getArtworkMediaUrl = (media_path) => {
  const cleanPath = media_path.startsWith("uploads/")
    ? media_path.slice("uploads/".length)
    : media_path;
  return `${API_BASE}/uploads/artwork/${cleanPath}`;
};

const getPostMediaUrl = (media_path) => {
  return `${API_BASE}/uploads/${media_path}`;
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState([]);
  const [loadingArtworks, setLoadingArtworks] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [selectedItemMedia, setSelectedItemMedia] = useState([]);
  const [loadingMedia, setLoadingMedia] = useState(false);

  // Fetch public artwork posts
  useEffect(() => {
    const fetchArtworks = async () => {
      setLoadingArtworks(true);
      try {
        const res = await axios.get(`${API_BASE}/api/artwork-posts/public`);
        setArtworks(res.data || []);
      } catch (err) {
        console.error("Error fetching public artworks:", err);
        setArtworks([]);
      } finally {
        setLoadingArtworks(false);
      }
    };
    fetchArtworks();
  }, []);



  // Fetch media for selected artwork (lightbox)
  const openArtworkLightbox = async (artwork) => {
    setSelectedItem({ ...artwork, type: "artwork" });
    setSelectedMediaIndex(0);
    setLoadingMedia(true);
    try {
      const res = await axios.get(
        `${API_BASE}/api/artwork-media/public/${artwork.id}`
      );
      setSelectedItemMedia(res.data || []);
    } catch (err) {
      console.error("Error fetching artwork media:", err);
      setSelectedItemMedia([]);
    } finally {
      setLoadingMedia(false);
    }
  };



  const closeLightbox = () => {
    setSelectedItem(null);
    setSelectedItemMedia([]);
    setSelectedMediaIndex(0);
  };

  const navigateMedia = (direction) => {
    if (selectedItemMedia.length <= 1) return;
    if (direction === "next") {
      setSelectedMediaIndex(
        (prev) => (prev + 1) % selectedItemMedia.length
      );
    } else {
      setSelectedMediaIndex(
        (prev) =>
          (prev - 1 + selectedItemMedia.length) % selectedItemMedia.length
      );
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedItem) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") navigateMedia("prev");
      if (e.key === "ArrowRight") navigateMedia("next");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedItem, selectedItemMedia]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-white dark:bg-[#0A0A0B] text-gray-900 dark:text-gray-400 transition-colors duration-300"
    >
      {/* Navbar */}
      <Navbar />

      {/* Seamless Compact Hero Section */}
      <div className="relative overflow-hidden flex items-center dark:border-b dark:border-gray-800">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-right md:bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/bg0001.compressed.webp')" }}
        >
          {/* Horizontal Gradient (Left to Right) for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 via-30% to-transparent dark:from-[#0A0A0B] dark:via-[#0A0A0B]/80"></div>

          {/* Vertical Gradient (Bottom Up) for seamless transition to content */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-transparent dark:from-[#0A0A0B]"></div>

          {/* Artist Credit */}
          <div className="absolute bottom-4 right-6 text-[10px] md:text-xs text-gray-400 dark:text-gray-500 font-medium tracking-wide bg-white/10 dark:bg-black/20 backdrop-blur-sm px-2 py-1 rounded-md border border-white/20 dark:border-gray-800 select-none transition-colors">
            Art by <span className="text-gray-600 dark:text-gray-400">Ralf Martinez</span>
          </div>
        </div>

        <div className="relative w-full px-6 py-8 md:py-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-left"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-400 mb-4 leading-[1.1] tracking-tight">
              Discover Art from{" "}
              <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-[#4F46E5] via-[#9333EA] to-[#DB2777] bg-clip-text text-transparent">
                Local Talent
              </span>
            </h1>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mb-6 leading-relaxed">
              Join a thriving community built to empower your creative journey and artistic career.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-start gap-4">
              <motion.button
                onClick={() => navigate("/signup")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#5E66FF] text-white rounded-full font-bold hover:bg-[#4D5BFF] transition-all duration-300 shadow-lg cursor-pointer text-sm"
              >
                Join Now
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content Grid — Artworks Only */}
      <div className="w-full px-6 py-8">
        {loadingArtworks ? (
          <LoadingSkeleton />
        ) : artworks.length > 0 ? (
          <MasonryGrid
            items={artworks}
            type="artwork"
            onItemClick={openArtworkLightbox}
          />
        ) : (
          <EmptyState message="No public artworks yet. Be the first to share your art!" />
        )}
      </div>

      {/* Floating CTA */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="fixed bottom-6 right-6 z-40"
      >
        <motion.button
          onClick={() => navigate("/signup")}
          whileHover={{ scale: 1.05, y: -4 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-5 py-3 bg-[#5E66FF] text-white rounded-full font-medium shadow-lg shadow-indigo-300/30 dark:shadow-none hover:bg-[#4D5BFF] hover:shadow-2xl hover:shadow-indigo-400/50 transition-all duration-300 cursor-pointer"
        >
          <Sparkles size={16} />
          Join Illura
        </motion.button>
      </motion.div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedItem && (
          <LightboxModal
            item={selectedItem}
            media={selectedItemMedia}
            mediaIndex={selectedMediaIndex}
            loadingMedia={loadingMedia}
            onClose={closeLightbox}
            onNavigate={navigateMedia}
            onLoginRedirect={handleLoginRedirect}
          />
        )}
      </AnimatePresence>
      <Footer />
    </motion.div>
  );
};

/* ─────────── MASONRY GRID COMPONENT ─────────── */
const MasonryGrid = ({ items, type, onItemClick }) => {
  return (
    <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-1">
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.02 }}
          className="break-inside-avoid mb-1"
        >
          <div
            onClick={() => onItemClick(item)}
            className="group relative overflow-hidden cursor-pointer"
          >
            {/* Image Container with background to reduce CLS */}
            <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-800 rounded-lg" style={{ minHeight: '150px' }}>
              <img
                src={
                  type === "artwork"
                    ? getArtworkMediaUrl(item.first_media)
                    : getPostMediaUrl(item.media_path)
                }
                alt={item.title}
                className="w-full h-auto max-h-[250px] object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                loading={index < 4 ? "eager" : "lazy"}
                fetchPriority={index < 4 ? "high" : "auto"}
                width="300"
                height="200"
                onContextMenu={(e) => e.preventDefault()}
                draggable={false}
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              {/* Hover Info */}
              <div className="absolute bottom-0 left-0 right-0 p-2.5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <p className="text-white text-xs font-semibold truncate">
                  {item.title}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  {item.author_pfp && item.author_pfp !== "default.png" ? (
                    <img
                      src={`${API_BASE}/uploads/${item.author_pfp}`}
                      alt={item.author}
                      className="w-5 h-5 rounded-full border border-white/80 object-cover"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-gray-400 border border-white/80 flex items-center justify-center">
                      <span className="text-white text-[9px] font-medium">
                        {item.author?.[0]?.toUpperCase() || "?"}
                      </span>
                    </div>
                  )}
                  <p className="text-white/80 text-[11px] truncate">
                    {item.author}
                  </p>
                  {item.is_verified === 1 && <VerifiedBadge />}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

/* ─────────── LIGHTBOX MODAL ─────────── */
const LightboxModal = ({
  item,
  media,
  mediaIndex,
  loadingMedia,
  onClose,
  onNavigate,
  onLoginRedirect,
}) => {
  const isArtwork = item.type === "artwork";

  const getCurrentMediaUrl = () => {
    if (media.length === 0) return "";
    const currentMedia = media[mediaIndex];
    if (isArtwork) {
      return getArtworkMediaUrl(currentMedia.media_path);
    }
    return getPostMediaUrl(currentMedia.media_path);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative max-w-5xl w-full max-h-[90vh] bg-white dark:bg-[#111112] rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-transparent dark:border-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image Area */}
        <div className="flex-[3] relative bg-gray-50 dark:bg-[#0A0A0B] flex items-center justify-center min-h-[300px] md:min-h-[500px]">
          {loadingMedia ? (
            <div className="flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-[#5E66FF] rounded-full animate-spin"></div>
            </div>
          ) : media.length > 0 ? (
            <>
              <img
                src={getCurrentMediaUrl()}
                alt={item.title}
                className="max-h-[85vh] w-auto max-w-full object-contain"
                onContextMenu={(e) => e.preventDefault()}
                draggable={false}
                style={{
                  userSelect: "none",
                  WebkitUserSelect: "none",
                }}
              />

              {/* Media Navigation */}
              {media.length > 1 && (
                <>
                  <button
                    onClick={() => onNavigate("prev")}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 p-2 rounded-full shadow-md transition-all duration-200"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => onNavigate("next")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 p-2 rounded-full shadow-md transition-all duration-200"
                  >
                    <ChevronRight size={20} />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
                    {mediaIndex + 1} / {media.length}
                  </div>
                </>
              )}
            </>
          ) : (
            <p className="text-gray-400">No media available</p>
          )}
        </div>

        {/* Info Sidebar */}
        <div className="flex-[1.5] flex flex-col border-l border-gray-100 dark:border-gray-800 max-h-[90vh] bg-white dark:bg-[#111112]">
          {/* Author Info */}
          <div className="p-5 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              {item.author_pfp && item.author_pfp !== "default.png" ? (
                <img
                  src={`${API_BASE}/uploads/${item.author_pfp}`}
                  alt={item.author}
                  className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-800 object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {item.author?.[0]?.toUpperCase() || "?"}
                  </span>
                </div>
              )}
              <div>
                <div className="flex items-center">
                  <p className="font-semibold text-gray-900 dark:text-gray-400">{item.author}</p>
                  {item.is_verified === 1 && <VerifiedBadge />}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-500">{item.fullname}</p>
              </div>
            </div>

            {/* Title & Description */}
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-300 mt-4">
              {item.title}
            </h2>
            {item.description && (
              <p className="text-sm text-gray-600 dark:text-gray-500 mt-1 leading-relaxed">
                {item.description}
              </p>
            )}

            {/* Date */}
            {item.created_at && (
              <p className="text-xs text-gray-400 mt-3">
                {formatDistanceToNow(new Date(item.created_at), {
                  addSuffix: true,
                })}
              </p>
            )}
          </div>

          {/* Interaction Buttons (disabled - redirect to login) */}
          <div className="p-5 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-5">
              <button
                onClick={onLoginRedirect}
                className="flex items-center gap-1.5 text-gray-400 hover:text-red-400 transition-colors duration-200"
                title="Log in to like"
              >
                <Heart size={20} />
                <span className="text-sm">Like</span>
              </button>
              <button
                onClick={onLoginRedirect}
                className="flex items-center gap-1.5 text-gray-400 hover:text-blue-400 transition-colors duration-200"
                title="Log in to comment"
              >
                <MessageCircle size={20} />
                <span className="text-sm">Comment</span>
              </button>
            </div>
          </div>

          {/* Sign Up CTA */}
          <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-50/50 dark:bg-gray-800/20">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center">
                <Sparkles size={20} className="text-[#5E66FF]" />
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-300 mb-1">
                Join the community
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mb-4 max-w-[200px]">
                Sign up to like, comment, follow artists, and share your own
                creations.
              </p>
              <button
                onClick={() => onLoginRedirect()}
                className="px-5 py-2 bg-[#5E66FF] text-white rounded-full text-sm font-medium hover:bg-[#4D5BFF] transition-all duration-200 shadow-md shadow-indigo-200"
              >
                Sign Up Free
              </button>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:hover:text-white rounded-full shadow-md transition-all duration-200 z-10"
        >
          <X size={18} />
        </button>
      </motion.div>
    </motion.div>
  );
};

/* ─────────── LOADING SKELETON ─────────── */
const LoadingSkeleton = () => (
  <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="break-inside-avoid mb-4">
        <div className="bg-white dark:bg-[#111112] rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-800">
          <div
            className="bg-gray-200 dark:bg-gray-800 animate-pulse"
            style={{ height: `${200 + Math.random() * 200}px` }}
          />
          <div className="p-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-3/4 mb-2" />
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
              <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-1/3" />
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

/* ─────────── EMPTY STATE ─────────── */
const EmptyState = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 transition-colors">
      <Palette size={28} className="text-gray-400 dark:text-gray-500" />
    </div>
    <p className="text-gray-600 dark:text-gray-300 text-lg mb-2">{message}</p>
    <p className="text-gray-500 dark:text-gray-400 text-sm">
      Join Illura to start sharing your art with the world.
    </p>
  </div>
);

export default LandingPage;
