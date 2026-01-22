const db = require("../config/database");

// Create a new artwork post
const createArtworkPost = (postData, callback) => {
  const sql = `
    INSERT INTO artwork_posts (author_id, title, description, visibility)
    VALUES (?, ?, ?, ?)
  `;
  const params = [
    postData.author_id, 
    postData.title, 
    postData.description,
    postData.visibility || "private"  // Default to private
  ];
  db.query(sql, params, callback);
};

const getAllArtworkPosts = (authorId, viewerId, callback) => {
  // Convert string IDs to numbers
  const authorIdNum = authorId ? parseInt(authorId) : null;
  const viewerIdNum = parseInt(viewerId);
  
  // DEFAULT QUERY: Show all artwork posts visible to the viewer (home feed)
  // This runs when NO authorId is provided (home page)
  let sql = `
    SELECT DISTINCT artwork_posts.id, artwork_posts.title, artwork_posts.description, 
           artwork_posts.created_at, artwork_posts.visibility,
           users.id AS author_id, users.username AS author, users.fullname, 
           users.pfp AS author_pfp, users.verified AS is_verified
    FROM artwork_posts
    JOIN users ON artwork_posts.author_id = users.id
    LEFT JOIN follows ON follows.following_id = artwork_posts.author_id AND follows.follower_id = ?
    WHERE users.account_status = 'active'
    AND (
      -- Public artwork posts from anyone
      artwork_posts.visibility = 'public'
      OR 
      -- Friends-only artwork posts from users the viewer follows OR from the viewer themselves
      (artwork_posts.visibility = 'friends' AND (follows.follower_id IS NOT NULL OR artwork_posts.author_id = ?))
      OR
      -- Private artwork posts only from the viewer themselves
      (artwork_posts.visibility = 'private' AND artwork_posts.author_id = ?)
    )
    ORDER BY artwork_posts.created_at DESC
  `;
  let params = [viewerIdNum, viewerIdNum, viewerIdNum];

  // If an authorId IS provided (viewing someone's profile page)
  if (authorId) {
    if (authorIdNum === viewerIdNum) {
      // Viewer is the author - show all posts
      sql = `
        SELECT artwork_posts.id, artwork_posts.title, artwork_posts.description, 
               artwork_posts.created_at, artwork_posts.visibility,
               users.id AS author_id, users.username AS author, users.fullname, 
               users.pfp AS author_pfp, users.verified AS is_verified
        FROM artwork_posts
        JOIN users ON artwork_posts.author_id = users.id
        WHERE artwork_posts.author_id = ?
        AND users.account_status = 'active'
        ORDER BY artwork_posts.created_at DESC
      `;
      params = [authorIdNum];
    } else {
      // Viewer is NOT the author - apply visibility rules
      sql = `
        SELECT artwork_posts.id, artwork_posts.title, artwork_posts.description, 
               artwork_posts.created_at, artwork_posts.visibility,
               users.id AS author_id, users.username AS author, users.fullname, 
               users.pfp AS author_pfp, users.verified AS is_verified
        FROM artwork_posts
        JOIN users ON artwork_posts.author_id = users.id
        WHERE artwork_posts.author_id = ?
        AND users.account_status = 'active'
        AND (
          artwork_posts.visibility = 'public'
          OR (
            artwork_posts.visibility = 'friends' 
            AND EXISTS (
              SELECT 1 FROM follows f1 
              WHERE f1.follower_id = ?
              AND f1.following_id = artwork_posts.author_id
            )
          )
        )
        ORDER BY artwork_posts.created_at DESC
      `;
      params = [authorIdNum, viewerIdNum];
    }
  }

  db.query(sql, params, callback);
};

// Get an artwork post by ID
const getArtworkPostById = (id, callback) => {
  const sql = `
    SELECT artwork_posts.id, artwork_posts.title, artwork_posts.description, 
           artwork_posts.created_at, artwork_posts.visibility,
           users.id AS author_id, users.username AS author, users.fullname, 
           users.pfp AS author_pfp, users.verified AS is_verified
    FROM artwork_posts
    JOIN users ON artwork_posts.author_id = users.id
    WHERE artwork_posts.id = ?
  `;
  db.query(sql, [id], callback);
};

// Get posts by a specific author (for user's own view)
const getArtworkPostsByAuthorId = (authorId, callback) => {
  const sql = `
    SELECT artwork_posts.id, artwork_posts.title, artwork_posts.description, 
           artwork_posts.created_at, artwork_posts.visibility,
           users.id AS author_id, users.username AS author, users.fullname, 
           users.pfp AS author_pfp, users.verified AS is_verified
    FROM artwork_posts
    JOIN users ON artwork_posts.author_id = users.id
    WHERE artwork_posts.author_id = ?
    ORDER BY artwork_posts.created_at DESC
  `;
  db.query(sql, [authorId], callback);
};

// Update an artwork post
const updateArtworkPostById = (id, postData, callback) => {
  const sql = `
    UPDATE artwork_posts
    SET title = ?, description = ?, visibility = ?
    WHERE id = ?
  `;
  db.query(sql, [postData.title, postData.description, postData.visibility, id], callback);
};

// Delete an artwork post
const deleteArtworkPost = (id, callback) => {
  const sql = `
    DELETE FROM artwork_posts
    WHERE id = ?
  `;
  db.query(sql, [id], callback);
};

// Get artwork posts from followed users
const getFollowingArtworkPosts = (viewerId, callback) => {
  const sql = `
    SELECT artwork_posts.id, artwork_posts.title, artwork_posts.description, 
           artwork_posts.created_at, artwork_posts.visibility,
           users.id AS author_id, users.username AS author, users.fullname, 
           users.pfp AS author_pfp, users.verified AS is_verified
    FROM artwork_posts
    JOIN users ON artwork_posts.author_id = users.id
    WHERE artwork_posts.author_id IN (
      SELECT following_id 
      FROM follows 
      WHERE follower_id = ?
    )
    AND users.account_status = 'active'
    AND (
      artwork_posts.visibility = 'public' 
      OR 
      (
        artwork_posts.visibility = 'friends' 
        AND EXISTS (
          SELECT 1 FROM follows f 
          WHERE f.follower_id = ? 
          AND f.following_id = artwork_posts.author_id
        )
      )
      OR
      artwork_posts.author_id = ?
    )
    ORDER BY artwork_posts.created_at DESC
  `;
  db.query(sql, [viewerId, viewerId, viewerId], callback);
};

module.exports = {
  createArtworkPost,
  getAllArtworkPosts,
  getArtworkPostById,
  getArtworkPostsByAuthorId,
  updateArtworkPostById,
  deleteArtworkPost,
  getFollowingArtworkPosts,
};