const db = require("../config/database");

// Create a new post
const createPost = (postData, callback) => {
  const sql = `
    INSERT INTO posts (author_id, title, media_path, post_status)
    VALUES (?, ?, ?, ?)
  `;
  const params = [
    postData.author_id,
    postData.title,
    postData.media_path,
    postData.post_status || "active", // Default status is "active"
  ];
  db.query(sql, params, callback);
};

// Get all posts (Now includes `author_pfp` and `post_status`)
const getAllPosts = (authorId, callback) => {
  let sql = `
    SELECT posts.id, posts.title, posts.media_path, posts.created_at, posts.updated_at,
           users.username AS author, users.fullname, users.pfp AS author_pfp, posts.post_status
    FROM posts
    JOIN users ON posts.author_id = users.id
    ORDER BY posts.created_at DESC
  `;
  const params = [];

  // Filter by author_id if provided
  if (authorId) {
    sql = `
      SELECT posts.id, posts.title, posts.media_path, posts.created_at, posts.updated_at,
             users.username AS author, users.fullname, users.pfp AS author_pfp, posts.post_status
      FROM posts
      JOIN users ON posts.author_id = users.id
      WHERE posts.author_id = ?
      ORDER BY posts.created_at DESC
    `;
    params.push(authorId);
  }

  db.query(sql, params, callback);
};

// Get posts by a specific author (Now includes `author_pfp` and `post_status`)
const getPostsByAuthorId = (authorId, callback) => {
  const sql = `
    SELECT posts.id, posts.title, posts.media_path, posts.created_at, posts.updated_at,
           users.username AS author, users.fullname, users.pfp AS author_pfp, posts.post_status
    FROM posts
    JOIN users ON posts.author_id = users.id
    WHERE posts.author_id = ?
    ORDER BY posts.created_at DESC
  `;
  db.query(sql, [authorId], callback);
};

// Get a post by ID (Now includes `author_pfp` and `post_status`)
const getPostById = (id, callback) => {
  const sql = `
    SELECT posts.id, posts.title, posts.media_path, posts.created_at, posts.updated_at,
           users.username AS author, users.fullname, users.pfp AS author_pfp, posts.post_status
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

// Update post status (Admin moderation feature)
const updatePostStatus = (postId, status, callback) => {
  const sql = `
    UPDATE posts
    SET post_status = ?
    WHERE id = ?
  `;
  db.query(sql, [status, postId], callback);
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
  getPostsByAuthorId,
  getPostById,
  updatePost,
  updatePostStatus, // New function for reporting and moderation
  deletePost,
};