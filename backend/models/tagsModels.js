const db = require("../config/database");

// Get or create a tag by name (returns tag_id)
const getOrCreateTag = (tagName, callback) => {
  // First, try to find existing tag
  const searchSql = "SELECT id FROM tags WHERE name = ?";
  
  db.query(searchSql, [tagName.toLowerCase().trim()], (err, results) => {
    if (err) return callback(err);
    
    // If tag exists, return its ID
    if (results.length > 0) {
      return callback(null, results[0].id);
    }
    
    // Tag doesn't exist, create it
    const insertSql = "INSERT INTO tags (name) VALUES (?)";
    db.query(insertSql, [tagName.toLowerCase().trim()], (insertErr, insertResult) => {
      if (insertErr) return callback(insertErr);
      callback(null, insertResult.insertId);
    });
  });
};

// Link a tag to an artwork post
const linkTagToPost = (postId, tagId, callback) => {
  const sql = "INSERT INTO artwork_tags (post_id, tag_id) VALUES (?, ?)";
  db.query(sql, [postId, tagId], callback);
};

// Get all tags for a specific post
const getTagsByPostId = (postId, callback) => {
  const sql = `
    SELECT t.id, t.name 
    FROM tags t
    INNER JOIN artwork_tags at ON t.id = at.tag_id
    WHERE at.post_id = ?
    ORDER BY t.name ASC
  `;
  db.query(sql, [postId], callback);
};

// Remove all tags from a post (for updating)
const removeTagsFromPost = (postId, callback) => {
  const sql = "DELETE FROM artwork_tags WHERE post_id = ?";
  db.query(sql, [postId], callback);
};

// Search tags by partial name (for autocomplete)
const searchTags = (query, callback) => {
  const sql = `
    SELECT id, name, 
           (SELECT COUNT(*) FROM artwork_tags WHERE tag_id = tags.id) as usage_count
    FROM tags 
    WHERE name LIKE ? 
    ORDER BY usage_count DESC, name ASC 
    LIMIT 10
  `;
  db.query(sql, [`%${query.toLowerCase()}%`], callback);
};

// Get popular tags (most used)
const getPopularTags = (limit, callback) => {
  const sql = `
    SELECT t.id, t.name, COUNT(at.id) as usage_count
    FROM tags t
    INNER JOIN artwork_tags at ON t.id = at.tag_id
    GROUP BY t.id, t.name
    ORDER BY usage_count DESC, t.name ASC
    LIMIT ?
  `;
  db.query(sql, [limit || 20], callback);
};

// Get all posts with a specific tag
const getPostsByTag = (tagName, callback) => {
  const sql = `
    SELECT ap.* 
    FROM artwork_posts ap
    INNER JOIN artwork_tags at ON ap.id = at.post_id
    INNER JOIN tags t ON at.tag_id = t.id
    WHERE t.name = ?
    ORDER BY ap.created_at DESC
  `;
  db.query(sql, [tagName.toLowerCase()], callback);
};

// Delete unused tags (cleanup function - optional)
const deleteUnusedTags = (callback) => {
  const sql = `
    DELETE FROM tags 
    WHERE id NOT IN (SELECT DISTINCT tag_id FROM artwork_tags)
  `;
  db.query(sql, callback);
};

module.exports = {
  getOrCreateTag,
  linkTagToPost,
  getTagsByPostId,
  removeTagsFromPost,
  searchTags,
  getPopularTags,
  getPostsByTag,
  deleteUnusedTags,
};