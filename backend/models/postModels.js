const db = require("../config/database");

// Create a Post
const createPost = (authorId, content, mediaFile) => {
  return new Promise((resolve, reject) => {
    console.log("Creating post with:", { authorId, content, mediaFile }); // Debug log
    if (!authorId || !content) {
      return reject(new Error("Author ID and content are required."));
    }

    const query = `
      INSERT INTO posts (author_id, content, media)
      VALUES (?, ?, ?)
    `;
    const mediaFileFinal = mediaFile || null; // Default to null if no media
    db.query(query, [authorId, content, mediaFileFinal], (err, results) => {
      if (err) {
        console.error("Error creating post:", err); // Log detailed database error
        return reject(new Error("Database error while creating post."));
      }
      resolve(results.insertId); // Return the new post ID
    });
  });
};

// Fetch All Posts with Pagination
const getAllPosts = (limit = 10, offset = 0) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        posts.id, 
        posts.author_id, 
        posts.content, 
        posts.media, 
        posts.created_at, 
        profiles.username AS author_username, 
        profiles.fullname AS author_fullname, 
        profiles.pfp AS author_profile_picture
      FROM 
        posts
      JOIN 
        profiles ON posts.author_id = profiles.id
      ORDER BY 
        posts.created_at DESC
      LIMIT ? OFFSET ?
    `;
    db.query(query, [limit, offset], (err, results) => {
      if (err) {
        console.error("Error fetching posts:", err);
        return reject(err);
      }
      resolve(results);
    });
  });
};

// Fetch a Single Post by ID
const getPostById = (id) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT posts.*, profiles.username AS author_username, profiles.fullname AS author_fullname, profiles.pfp AS author_profile_picture
      FROM posts
      JOIN profiles ON posts.author_id = profiles.id
      WHERE posts.id = ?
    `;
    db.query(query, [id], (err, results) => {
      if (err) {
        console.error("Error fetching post by ID:", err);
        return reject(err);
      }
      if (!results.length) {
        resolve(null); // Return null if no post is found
      }
      resolve(results[0]); // Return the first matching post
    });
  });
};

// Update a Post
const updatePost = (id, content, mediaUrl) => {
  return new Promise((resolve, reject) => {
    const fields = [];
    const values = [];
    if (content) {
      fields.push("content = ?");
      values.push(content);
    }
    if (mediaUrl) {
      fields.push("media_url = ?");
      values.push(mediaUrl);
    }
    values.push(id); // Add post ID as the last parameter

    const query = `
      UPDATE posts
      SET ${fields.join(", ")}
      WHERE id = ?
    `;
    db.query(query, values, (err, results) => {
      if (err) {
        console.error("Error updating post:", err);
        return reject(err);
      }
      resolve(results.affectedRows > 0); // Return true if rows were updated
    });
  });
};

// Delete a Post
const deletePost = (id, authorId) => {
  return new Promise((resolve, reject) => {
    const query = `
      DELETE FROM posts
      WHERE id = ? AND author_id = ?
    `;
    db.query(query, [id, authorId], (err, results) => {
      if (err) {
        console.error("Error deleting post:", err);
        return reject(err);
      }
      resolve(results.affectedRows > 0); // Return true if rows were deleted
    });
  });
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
};