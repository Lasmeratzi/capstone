// src/pages/locations/LocationPostsPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  MapPin,
  MessageCircle,
  MoreVertical,
  Tag as TagIcon,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import ArtworkLikes from "../likes/artworklikes";
import ArtworkComments from "../comments/artworkcomments";
import Sidebar from "../sidebar/sidebar";

const API_BASE = "http://localhost:5000";

const getMediaUrl = (media_path) => {
  const cleanPath = media_path.startsWith("uploads/")
    ? media_path.slice("uploads/".length)
    : media_path;
  return `${API_BASE}/uploads/artwork/${cleanPath}`;
};

const ProtectedMedia = ({ file, onClick, className = "" }) => {
  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const mediaUrl = getMediaUrl(file.media_path);
  const isVideo = file.media_path.endsWith(".mp4");

  return (
    <div
      className={`relative ${className}`}
      onClick={onClick}
      onContextMenu={handleContextMenu}
      onDragStart={handleDragStart}
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
      }}
    >
      {isVideo ? (
        <div className="w-full h-full bg-black flex items-center justify-center relative">
          <video
            src={mediaUrl}
            className="w-full h-full object-cover pointer-events-none"
            muted
            preload="metadata"
            playsInline
            onContextMenu={handleContextMenu}
            onDragStart={handleDragStart}
          />
        </div>
      ) : (
        <img
          src={mediaUrl}
          alt="Artwork media"
          className="w-full h-full object-cover pointer-events-none"
          loading="lazy"
          onContextMenu={handleContextMenu}
          onDragStart={handleDragStart}
          draggable={false}
        />
      )}
    </div>
  );
};

const LocationPostsPage = () => {
  const { locationId } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [commentCounts, setCommentCounts] = useState({});
  const [showCommentsMap, setShowCommentsMap] = useState({});
  const [postTags, setPostTags] = useState({});

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("id");

  useEffect(() => {
    fetchPostsByLocation();
  }, [locationId]);

  const fetchPostsByLocation = async () => {
    setLoading(true);
    setError("");
    
    try {
      const response = await axios.get(
        `${API_BASE}/api/locations/${locationId}/posts`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Location posts response:", response.data);

      // Fetch media and tags for each post
      const postsWithMedia = await Promise.all(
        response.data.posts.map(async (post) => {
          try {
            const mediaResponse = await axios.get(
              `${API_BASE}/api/artwork-media/${post.id}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            
            const tagsResponse = await axios.get(
              `${API_BASE}/api/tags/post/${post.id}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            return {
              ...post,
              media: mediaResponse.data || [],
              tags: tagsResponse.data || []
            };
          } catch (mediaError) {
            console.error(`Error fetching media for post ${post.id}:`, mediaError);
            return { ...post, media: [], tags: [] };
          }
        })
      );

      setPosts(postsWithMedia);
      setLocation(response.data.location);

      // Store tags separately for easy access
      const tagsMap = {};
      postsWithMedia.forEach(post => {
        tagsMap[post.id] = post.tags;
      });
      setPostTags(tagsMap);

      // Fetch comment counts for each post
      postsWithMedia.forEach((post) => {
        fetchCommentCount(post.id);
      });
    } catch (err) {
      console.error("Error fetching posts by location:", err);
      setError("Failed to load posts for this location. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCommentCount = async (artworkPostId) => {
    try {
      const res = await axios.get(
        `${API_BASE}/api/artwork-comments/count/${artworkPostId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCommentCounts((prev) => ({ ...prev, [artworkPostId]: res.data.count ?? 0 }));
    } catch (err) {
      console.error("Error fetching comment count:", err);
    }
  };

  const toggleComments = (postId) => {
    setShowCommentsMap((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
    fetchCommentCount(postId);
  };

  const handleTagClick = (tagName) => {
    navigate(`/tags/${tagName}`);
  };

  const renderMediaGrid = (media) => {
    const count = media.length;
    if (count === 1)
      return <ProtectedMedia file={media[0]} className="w-full h-full rounded-lg" />;
    if (count === 2)
      return (
        <div className="grid grid-cols-2 gap-1">
          {media.map((file, index) => (
            <ProtectedMedia key={file.id} file={file} className="w-full h-full aspect-square rounded-lg" />
          ))}
        </div>
      );
    if (count === 3)
      return (
        <div className="grid grid-cols-2 gap-1">
          <div className="row-span-2 aspect-square">
            <ProtectedMedia file={media[0]} className="w-full h-full rounded-lg" />
          </div>
          <div className="aspect-square">
            <ProtectedMedia file={media[1]} className="w-full h-full rounded-lg" />
          </div>
          <div className="aspect-square">
            <ProtectedMedia file={media[2]} className="w-full h-full rounded-lg" />
          </div>
        </div>
      );
    if (count === 4)
      return (
        <div className="grid grid-cols-2 gap-1">
          {media.map((file, index) => (
            <ProtectedMedia key={file.id} file={file} className="w-full h-full aspect-square rounded-lg" />
          ))}
        </div>
      );
    return (
      <div className="grid grid-cols-2 gap-1">
        {media.slice(0, 4).map((file, index) => (
          <div key={file.id} className={`aspect-square relative`}>
            <ProtectedMedia file={file} className="w-full h-full rounded-lg" />
            {index === 3 && (
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center text-white font-bold text-xl pointer-events-none rounded-lg">
                +{media.length - 4}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex">
        <div className="fixed h-screen w-60">
          <Sidebar />
        </div>
        <div className="ml-60 flex-grow py-6 px-8 md:px-20 lg:px-40">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading posts from location...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
  <div className="flex">
    <div className="fixed h-screen w-60">
      <Sidebar />
    </div>

    <div className="ml-60 flex-grow py-6 px-8 md:px-20 lg:px-40">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-100 rounded-full">
            <MapPin size={24} className="text-red-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {location ? `${location.name}, ${location.province}` : 'Location'}
            </h1>
            <p className="text-gray-600">
              {posts.length} {posts.length === 1 ? 'post' : 'posts'}
            </p>
          </div>
        </div>
      </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
            <button
              onClick={fetchPostsByLocation}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Posts Grid */}
        {posts.length > 0 ? (
          <div className="max-w-2xl mx-auto space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                {/* Post Header */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    {post.author_pfp ? (
                      <img
                        src={`${API_BASE}/uploads/${post.author_pfp}`}
                        alt={`${post.author}'s profile`}
                        className="w-10 h-10 rounded-full border border-gray-300 object-cover"
                        onError={(e) => {
                          e.target.src = "/default-avatar.png";
                        }}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-600 text-xs">N/A</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{post.author || "Unknown User"}</p>
                      <p className="text-gray-600 text-sm">{post.fullname || ""}</p>
                      {post.created_at && (
                        <p className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-gray-800 mt-2">{post.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{post.description}</p>

                  {/* Display Tags */}
                  {postTags[post.id] && postTags[post.id].length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {postTags[post.id].map((tag) => (
                        <button
                          key={tag.id}
                          onClick={() => handleTagClick(tag.name)}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium hover:bg-blue-100 transition-colors"
                        >
                          <TagIcon size={12} />
                          #{tag.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Media */}
                {post.media?.length > 0 && (
                  <div className="p-4">
                    {renderMediaGrid(post.media)}
                  </div>
                )}

                {/* Actions */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <ArtworkLikes artworkPostId={post.id} />
                      <button
                        onClick={() => toggleComments(post.id)}
                        className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
                      >
                        <MessageCircle size={18} />
                        <span className="text-sm">{commentCounts[post.id] ?? 0}</span>
                      </button>
                    </div>
                    
                    <Link
                      to={`/artwork/${post.id}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View Art Work
                    </Link>
                  </div>

                  {/* Comments Section */}
                  {showCommentsMap[post.id] && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <ArtworkComments artworkPostId={post.id} userId={userId} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <MapPin size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No posts found</h3>
            <p className="text-gray-500">
              No artwork posts from <span className="font-semibold">
                {location ? `${location.city}, ${location.province}` : 'this location'}
              </span> yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationPostsPage;