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
           users.id AS author_id, users.username AS author, users.fullname, users.pfp AS author_pfp, posts.post_status
    FROM posts
    JOIN users ON posts.author_id = users.id
    ORDER BY posts.created_at DESC
  `;
  const params = [];

  if (authorId) {
    sql = `
      SELECT posts.id, posts.title, posts.media_path, posts.created_at, posts.updated_at,
             users.id AS author_id, users.username AS author, users.fullname, users.pfp AS author_pfp, posts.post_status
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
           users.username AS author, users.fullname, users.pfp AS author_pfp, posts.post_status,
           posts.author_id  -- Added to verify ownership for updates/deletion
    FROM posts
    JOIN users ON posts.author_id = users.id
    WHERE posts.id = ?
  `;
  db.query(sql, [id], callback);
};

// Update a post (Only if user is the author)
// Update post by ID with data
const updatePostById = (id, postData, callback) => {
  const { title, media_path } = postData;

  const sql = `
    UPDATE posts
    SET title = ?, media_path = ?
    WHERE id = ?
  `;
  db.query(sql, [title, media_path, id], callback);
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

// Delete a post (Only if user is the author)
const deletePost = (id, authorId, callback) => {
  if (!id || !authorId) {
    return callback(new Error("Invalid post ID or author ID"));
  }

  const sql = `
    DELETE FROM posts
    WHERE id = ? AND author_id = ?
  `;
  
  db.query(sql, [id, authorId], callback);
};

module.exports = {
  createPost,
  getAllPosts,
  getPostsByAuthorId,
  getPostById,
  updatePostById,
  updatePostStatus,
  deletePost,
};