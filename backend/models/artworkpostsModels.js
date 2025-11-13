const db = require("../config/database");

// Create a new artwork post
const createArtworkPost = (postData, callback) => {
  const sql = `
    INSERT INTO artwork_posts (author_id, title, description)
    VALUES (?, ?, ?)
  `;
  const params = [postData.author_id, postData.title, postData.description];
  db.query(sql, params, callback);
};

// Get all artwork posts
const getAllArtworkPosts = (callback) => {
  const sql = `
  SELECT artwork_posts.id, artwork_posts.title, artwork_posts.description, artwork_posts.created_at,
         users.id AS author_id, users.username AS author, users.fullname, users.pfp AS author_pfp,
         users.verified AS is_verified  -- ✅ ADD THIS LINE
  FROM artwork_posts
  JOIN users ON artwork_posts.author_id = users.id
  ORDER BY artwork_posts.created_at DESC
`;

  db.query(sql, callback);
};

// Get an artwork post by ID
const getArtworkPostById = (id, callback) => {
  const sql = `
  SELECT artwork_posts.id, artwork_posts.title, artwork_posts.description, artwork_posts.created_at,
         users.id AS author_id, users.username AS author, users.fullname, users.pfp AS author_pfp,
         users.verified AS is_verified  -- ✅ ADD THIS LINE
  FROM artwork_posts
  JOIN users ON artwork_posts.author_id = users.id
  WHERE artwork_posts.id = ?
`;

  db.query(sql, [id], callback);
};

// Get posts by a specific author
const getArtworkPostsByAuthorId = (authorId, callback) => {
  const sql = `
    SELECT artwork_posts.id, artwork_posts.title, artwork_posts.description, artwork_posts.created_at,
           users.id AS author_id, users.username AS author, users.fullname, users.pfp AS author_pfp,
           users.verified AS is_verified  -- ✅ ADD THIS LINE
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
    SET title = ?, description = ?
    WHERE id = ?
  `;
  db.query(sql, [postData.title, postData.description, id], callback);
};

// Delete an artwork post
const deleteArtworkPost = (id, callback) => {
  const sql = `
    DELETE FROM artwork_posts
    WHERE id = ?
  `;
  db.query(sql, [id], callback);
};

module.exports = {
  createArtworkPost,
  getAllArtworkPosts,
  getArtworkPostById,
  getArtworkPostsByAuthorId,
  updateArtworkPostById,
  deleteArtworkPost,
};