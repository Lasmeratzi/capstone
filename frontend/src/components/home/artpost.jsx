import React, { useEffect, useState } from "react";
import axios from "axios";
import { X } from "lucide-react";

const API_BASE = "http://localhost:5000";

const ArtPosts = () => {
  const [artPosts, setArtPosts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);

  const fetchArtPostsWithMedia = async () => {
    setLoading(true);
    setErrorMessage("");
    const token = localStorage.getItem("token");
    if (!token) {
      setErrorMessage("You must be logged in to view artwork posts.");
      setLoading(false);
      return;
    }

    try {
      const postsResponse = await axios.get(`${API_BASE}/api/artwork-posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const posts = postsResponse.data;
      const mediaRequests = posts.map((post) =>
        axios.get(`${API_BASE}/api/artwork-media/${post.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      );

      const mediaResponses = await Promise.all(mediaRequests);
      const postsWithMedia = posts.map((post, index) => ({
        ...post,
        media: mediaResponses[index].data || [],
      }));

      setArtPosts(postsWithMedia);
    } catch (error) {
      console.error("Failed to fetch artwork posts or media:", error);
      setErrorMessage("Failed to load artwork posts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtPostsWithMedia();
  }, []);

  const getGalleryLayoutClass = (mediaCount) => {
    if (mediaCount === 1) return "grid-cols-1";
    if (mediaCount === 2) return "grid-cols-2";
    if (mediaCount === 3) return "grid-cols-2";
    if (mediaCount === 4) return "grid-cols-2";
    return "grid-cols-3";
  };

  const getMediaClass = (mediaCount, index) => {
    if (mediaCount === 1) return "row-span-2 col-span-2";
    if (mediaCount === 2) return "row-span-2";
    if (mediaCount === 3 && index === 0) return "row-span-2 col-span-1";
    return "";
  };

  if (loading) {
    return (
      <div className="text-center p-6 text-gray-600">Loading artwork posts...</div>
    );
  }

  if (errorMessage) {
    return (
      <div className="text-center p-6 text-red-500">
        <p>{errorMessage}</p>
        <button
          onClick={fetchArtPostsWithMedia}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {artPosts.length > 0 ? (
        artPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
          >
            {post.post_status === "down" && (
              <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center rounded-lg pointer-events-none">
                <p className="text-white text-lg font-semibold">🚫 Post is taken down</p>
              </div>
            )}

            <div className="flex items-center gap-3 mb-3">
              {post.author_pfp ? (
                <img
                  src={`${API_BASE}/uploads/${post.author_pfp}`}
                  alt={`${post.author}'s profile`}
                  className="w-10 h-10 rounded-full border border-gray-300 object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-600 text-xs">N/A</span>
                </div>
              )}
              <div>
                <p className="font-bold text-gray-800">{post.author}</p>
                <p className="text-gray-600 text-sm">{post.fullname}</p>
              </div>
            </div>

            <h4 className="text-base text-gray-800 mb-2">{post.title}</h4>
            <p className="text-gray-600 mb-3">{post.description}</p>

            {post.media?.length > 0 && (
              <div className={`grid ${getGalleryLayoutClass(post.media.length)} gap-2 rounded-lg overflow-hidden`}>
                {post.media.map((file, index) => (
                  <div
                    key={file.id}
                    className={`relative aspect-square ${getMediaClass(post.media.length, index)}`}
                    onClick={() => setSelectedMedia(file)}
                  >
                    {file.media_path.endsWith(".mp4") ? (
                      <div className="w-full h-full bg-black flex items-center justify-center">
                        <video
                          src={`${API_BASE}/${file.media_path}`}
                          className="w-full h-full object-cover"
                          muted
                          preload="metadata"
                          playsInline
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={`${API_BASE}/${file.media_path}`}
                        alt="Artwork media"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center">No artwork posts yet.</p>
      )}

      {selectedMedia && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
          onClick={() => setSelectedMedia(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedMedia(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition"
            >
              <X size={32} />
            </button>
            {selectedMedia.media_path.endsWith(".mp4") ? (
              <video
                src={`${API_BASE}/${selectedMedia.media_path}`}
                controls
                autoPlay
                className="max-h-[80vh] w-full rounded"
              />
            ) : (
              <img
                src={`${API_BASE}/${selectedMedia.media_path}`}
                alt="Artwork media preview"
                className="max-h-[80vh] w-auto max-w-full mx-auto rounded"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtPosts;