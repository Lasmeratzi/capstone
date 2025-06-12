import React, { useEffect, useState } from "react";
import axios from "axios";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const API_BASE = "http://localhost:5000";

const getMediaUrl = (media_path) => {
  const cleanPath = media_path.startsWith("uploads/")
    ? media_path.slice("uploads/".length)
    : media_path;
  return `${API_BASE}/uploads/artwork/${cleanPath}`;
};

const ArtPosts = () => {
  const [artPosts, setArtPosts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentMedia, setCurrentMedia] = useState({
    file: null,
    index: 0,
    mediaArray: []
  });
  const [showMediaViewer, setShowMediaViewer] = useState(false);

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

  const openMediaViewer = (file, index, mediaArray) => {
    setCurrentMedia({
      file,
      index,
      mediaArray
    });
    setShowMediaViewer(true);
  };

  const navigateMedia = (direction) => {
    const newIndex = direction === 'next' 
      ? (currentMedia.index + 1) % currentMedia.mediaArray.length
      : (currentMedia.index - 1 + currentMedia.mediaArray.length) % currentMedia.mediaArray.length;
    
    setCurrentMedia({
      ...currentMedia,
      file: currentMedia.mediaArray[newIndex],
      index: newIndex
    });
  };

  const renderMediaGrid = (media) => {
    const count = media.length;
    
    if (count === 1) {
      return (
        <div className="w-full rounded-lg overflow-hidden">
          <MediaItem 
            file={media[0]} 
            onClick={() => openMediaViewer(media[0], 0, media)} 
          />
        </div>
      );
    }

    if (count === 2) {
      return (
        <div className="grid grid-cols-2 gap-1">
          {media.map((file, index) => (
            <div key={file.id} className="aspect-square">
              <MediaItem 
                file={file} 
                onClick={() => openMediaViewer(file, index, media)} 
              />
            </div>
          ))}
        </div>
      );
    }

    if (count === 3) {
      return (
        <div className="grid grid-cols-2 gap-1">
          <div className="row-span-2 aspect-square">
            <MediaItem 
              file={media[0]} 
              onClick={() => openMediaViewer(media[0], 0, media)} 
            />
          </div>
          <div className="aspect-square">
            <MediaItem 
              file={media[1]} 
              onClick={() => openMediaViewer(media[1], 1, media)} 
            />
          </div>
          <div className="aspect-square">
            <MediaItem 
              file={media[2]} 
              onClick={() => openMediaViewer(media[2], 2, media)} 
            />
          </div>
        </div>
      );
    }

    if (count === 4) {
      return (
        <div className="grid grid-cols-2 gap-1">
          {media.map((file, index) => (
            <div key={file.id} className="aspect-square">
              <MediaItem 
                file={file} 
                onClick={() => openMediaViewer(file, index, media)} 
              />
            </div>
          ))}
        </div>
      );
    }

    // For 5+ images - show first 4 with +X overlay on the 4th image
    return (
      <div className="grid grid-cols-2 gap-1">
        {media.slice(0, 4).map((file, index) => (
          <div 
            key={file.id} 
            className={`aspect-square relative ${index === 3 ? 'cursor-pointer' : ''}`}
            onClick={() => index === 3 
              ? openMediaViewer(media[3], 3, media) 
              : openMediaViewer(file, index, media)}
          >
            <MediaItem file={file} />
            {index === 3 && (
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center text-white font-bold text-xl">
                +{media.length - 4}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const MediaItem = ({ file, onClick }) => {
    return (
      <div className="w-full h-full" onClick={onClick}>
        {file.media_path.endsWith(".mp4") ? (
          <div className="w-full h-full bg-black flex items-center justify-center">
            <video
              src={getMediaUrl(file.media_path)}
              className="w-full h-full object-cover"
              muted
              preload="metadata"
              playsInline
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </div>
            </div>
          </div>
        ) : (
          <img
            src={getMediaUrl(file.media_path)}
            alt="Artwork media"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        )}
      </div>
    );
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
              <div className="mt-3">
                {renderMediaGrid(post.media)}
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center">No artwork posts yet.</p>
      )}

      {showMediaViewer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
          onClick={() => setShowMediaViewer(false)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowMediaViewer(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition"
            >
              <X size={32} />
            </button>

            <div className="relative h-full">
              {currentMedia.mediaArray.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateMedia('prev');
                    }}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 z-10"
                  >
                    <ChevronLeft size={32} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateMedia('next');
                    }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 z-10"
                  >
                    <ChevronRight size={32} />
                  </button>
                </>
              )}
              {currentMedia.file.media_path.endsWith(".mp4") ? (
                <video
                  src={getMediaUrl(currentMedia.file.media_path)}
                  controls
                  autoPlay
                  className="max-h-[80vh] w-full rounded"
                />
              ) : (
                <img
                  src={getMediaUrl(currentMedia.file.media_path)}
                  alt="Artwork media preview"
                  className="max-h-[80vh] w-auto max-w-full mx-auto rounded"
                />
              )}
              <div className="absolute bottom-4 left-0 right-0 text-center text-white">
                {currentMedia.index + 1} of {currentMedia.mediaArray.length}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtPosts;