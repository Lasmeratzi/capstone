const db = require("../config/database");

// Create a new post
const createPost = (postData, callback) => {
    const sql = `
      INSERT INTO posts (author_id, title, media_path)
      VALUES (?, ?, ?)
    `;
    const params = [
      postData.author_id,
      postData.title,
      postData.media_path,
    ];
    db.query(sql, params, callback);
  };

// Get all posts
const getAllPosts = (callback) => {
  const sql = `
    SELECT posts.id, posts.title, posts.media_path, posts.created_at, posts.updated_at, users.username AS author
    FROM posts
    JOIN users ON posts.author_id = users.id
    ORDER BY posts.created_at DESC
  `;
  db.query(sql, callback);
};

// Get a post by ID
const getPostById = (id, callback) => {
  const sql = `
    SELECT posts.id, posts.title, posts.media_path, posts.created_at, posts.updated_at, users.username AS author
    FROM posts
    JOIN users ON posts.author_id = users.id
    WHERE posts.id = ?
  `;
  db.query(sql, [id], callback);
};

// Update a post
const updatePost = (id, postData, callback) => {
  const sql = `
    UPDATE posts
    SET title = ?, media_path = ?
    WHERE id = ?
  `;
  const params = [
    postData.title,         // Updated title
    postData.media_path,    // Updated media path (optional)
    id,                     // Post ID
  ];
  db.query(sql, params, callback);
};

// Delete a post
const deletePost = (id, callback) => {
  const sql = `
    DELETE FROM posts
    WHERE id = ?
  `;
  db.query(sql, [id], callback);
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
};