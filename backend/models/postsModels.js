const db = require("../config/database");

// Create a new post
const createPost = (postData, callback) => {
  const sql = `
    INSERT INTO posts (author_id, title, media_path, post_status, visibility)
    VALUES (?, ?, ?, ?, ?)
  `;
  const params = [
    postData.author_id,
    postData.title,
    postData.media_path,
    postData.post_status || "active",
    postData.visibility || "private", // Changed from 'public' to 'private'
  ];
  db.query(sql, params, callback);
};

const getAllPosts = (authorId, viewerId, callback) => {
  console.log("📊 getAllPosts model called with:");
  console.log("  - authorId:", authorId);
  console.log("  - viewerId:", viewerId);
  
  // Convert string IDs to numbers for consistent comparison
  const authorIdNum = parseInt(authorId);
  const viewerIdNum = parseInt(viewerId);
  
  let sql = `
    SELECT posts.id, posts.title, posts.media_path, posts.created_at, posts.updated_at,
           users.id AS author_id, users.username AS author, users.fullname, users.pfp AS author_pfp, 
           posts.post_status, posts.visibility, users.verified AS is_verified
    FROM posts
    JOIN users ON posts.author_id = users.id
    WHERE posts.visibility = 'public'
    AND posts.post_status = 'active'
    AND users.account_status = 'active'
    ORDER BY posts.created_at DESC
  `;
  const params = [];

  if (authorId) {
    if (authorIdNum === viewerIdNum) {
      console.log("👤 Viewer is the author - showing ALL posts");
      sql = `
        SELECT posts.id, posts.title, posts.media_path, posts.created_at, posts.updated_at,
               users.id AS author_id, users.username AS author, users.fullname, users.pfp AS author_pfp, 
               posts.post_status, posts.visibility, users.verified AS is_verified
        FROM posts
        JOIN users ON posts.author_id = users.id
        WHERE posts.author_id = ?
        AND posts.post_status = 'active'
        AND users.account_status = 'active'
        ORDER BY posts.created_at DESC
      `;
      params.push(authorIdNum);
    } else {
      console.log("👥 Viewer is NOT the author - checking if viewer follows author");
      sql = `
        SELECT posts.id, posts.title, posts.media_path, posts.created_at, posts.updated_at,
               users.id AS author_id, users.username AS author, users.fullname, users.pfp AS author_pfp, 
               posts.post_status, posts.visibility, users.verified AS is_verified
        FROM posts
        JOIN users ON posts.author_id = users.id
        WHERE posts.author_id = ?
        AND posts.post_status = 'active'
        AND users.account_status = 'active'
        AND (
          posts.visibility = 'public'
          OR (
            posts.visibility = 'friends' 
            AND EXISTS (
              SELECT 1 FROM follows f1 
              WHERE f1.follower_id = ?  -- Viewer follows author
              AND f1.following_id = posts.author_id
            )
          )
        )
        ORDER BY posts.created_at DESC
      `;
      params.push(authorIdNum, viewerIdNum); // Only need viewerId once now
    }
  }

  console.log("📝 SQL being executed:", sql);
  console.log("🔢 Parameters (converted):", params);

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("❌ SQL Error:", err);
      return callback(err);
    }
    console.log(`📊 Query returned ${results.length} posts`);
    console.log("📋 Posts visibility breakdown:", 
      results.reduce((acc, post) => {
        acc[post.visibility] = (acc[post.visibility] || 0) + 1;
        return acc;
      }, {})
    );
    callback(null, results);
  });
};

// Get posts by a specific author
const getPostsByAuthorId = (authorId, callback) => {
  const sql = `
    SELECT posts.id, posts.title, posts.media_path, posts.created_at, posts.updated_at,
           users.username AS author, users.fullname, users.pfp AS author_pfp, 
           posts.post_status, posts.visibility, users.verified AS is_verified
    FROM posts
    JOIN users ON posts.author_id = users.id
    WHERE posts.author_id = ?
    ORDER BY posts.created_at DESC
  `;
  db.query(sql, [authorId], callback);
};

// Get a post by ID
const getPostById = (id, callback) => {
  const sql = `
    SELECT posts.id, posts.title, posts.media_path, posts.created_at, posts.updated_at,
           users.username AS author, users.fullname, users.pfp AS author_pfp, posts.post_status,
           posts.author_id, posts.visibility, users.verified AS is_verified  -- ✅ ADD visibility
    FROM posts
    JOIN users ON posts.author_id = users.id
    WHERE posts.id = ?
  `;
  db.query(sql, [id], callback);
};

const getFollowingPosts = (viewerId, callback) => {
  const sql = `
    SELECT posts.id, posts.title, posts.media_path, posts.created_at, posts.updated_at,
           users.id AS author_id, users.username AS author, users.fullname, users.pfp AS author_pfp, 
           posts.post_status, posts.visibility, users.verified AS is_verified
    FROM posts
    JOIN users ON posts.author_id = users.id
    WHERE posts.author_id IN (
      SELECT following_id 
      FROM follows 
      WHERE follower_id = ?
    )
    AND posts.post_status = 'active'
    AND users.account_status = 'active'
    AND (
      posts.visibility = 'public' 
      OR 
      (
        posts.visibility = 'friends' 
        AND EXISTS (
          SELECT 1 FROM follows f 
          WHERE f.follower_id = ? 
          AND f.following_id = posts.author_id
        )
      )
      OR
      posts.author_id = ?
    )
    ORDER BY posts.created_at DESC
  `;
  db.query(sql, [viewerId, viewerId, viewerId], callback);
};

// Update post by ID with data
const updatePostById = (id, postData, callback) => {
  const { title, media_path, visibility } = postData; // Add visibility

  const sql = `
    UPDATE posts
    SET title = ?, media_path = ?, visibility = ?
    WHERE id = ?
  `;
  db.query(sql, [title, media_path, visibility, id], callback); // Add visibility
}



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
  getFollowingPosts,
};