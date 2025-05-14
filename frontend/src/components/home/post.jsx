import React from "react";

const Post = ({ post, userId, handleDelete }) => {
  return (
    <div className="relative bg-white p-4 rounded-lg shadow-md text-sm max-w-2xl mx-auto lg:ml-0 mb-5 border border-gray-200">
      {/* Overlay for 'Taken Down' Posts */}
      {post.post_status === "down" && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center rounded-lg">
          <p className="text-white text-lg font-semibold">🚫 Post is taken down</p>
        </div>
      )}

      {/* Author Info (Top) */}
      <div className="flex items-center gap-3 mb-3">
        {/* Profile Picture */}
        {post.author_pfp ? (
          <img
            src={`http://localhost:5000/uploads/${post.author_pfp}`}
            alt={post.author}
            className="w-10 h-10 rounded-full border border-gray-300"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-gray-600 text-xs">N/A</span>
          </div>
        )}

        {/* Username & Fullname */}
        <div>
          <p className="font-bold text-gray-800">{post.author}</p>
          <p className="text-gray-600 text-sm">{post.fullname}</p>
        </div>
      </div>

      {/* Post Title */}
      <h4 className="font-semibold text-base text-gray-800">{post.title}</h4>

      {/* Media (if available) */}
      {post.media_path && (
        <img
          src={`http://localhost:5000/uploads/${post.media_path}`}
          alt={post.title}
          className="w-full object-contain rounded mt-2"
        />
      )}

      {/* Timestamp */}
      <p className="text-gray-500 text-xs mt-2">
        Uploaded on {new Date(post.created_at).toLocaleDateString()} at {new Date(post.created_at).toLocaleTimeString()}
      </p>

      {/* Actions (Edit/Delete) */}
      {post.author_id === userId && post.post_status !== "down" && (
        <div className="flex justify-end gap-2 mt-3">
          <button
            onClick={() => alert("Edit functionality goes here")}
            className="text-blue-500 font-medium text-xs hover:text-blue-600"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(post.id)}
            className="text-red-500 font-medium text-xs hover:text-red-600"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default Post;