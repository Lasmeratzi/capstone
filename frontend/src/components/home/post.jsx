import React from "react";

const Post = ({ post, userId, handleDelete }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md text-sm max-w-2xl mx-auto lg:ml-0 mb-5 border border-gray-200">
      <h4 className="font-semibold text-base text-gray-800">{post.title}</h4>
      {post.media_path && (
        <img
          src={`http://localhost:5000/uploads/${post.media_path}`}
          alt={post.title}
          className="w-full object-contain rounded mt-2"
        />
      )}
      <p className="text-gray-500 text-xs mt-2">
        Posted by {post.author} on {new Date(post.created_at).toLocaleDateString()}
      </p>

      {/* Actions */}
      {post.author_id === userId && (
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