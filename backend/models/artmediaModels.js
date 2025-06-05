const db = require("../config/database");

// Insert media associated with an artwork post
const addArtworkMedia = (mediaData, callback) => {
  const sql = `
    INSERT INTO artwork_media (post_id, media_path)
    VALUES (?, ?)
  `;
  db.query(sql, [mediaData.post_id, mediaData.media_path], callback);
};

// Get all media for a specific artwork post
const getArtworkMediaByPostId = (postId, callback) => {
  const sql = `
    SELECT id, media_path
    FROM artwork_media
    WHERE post_id = ?
    ORDER BY id ASC
  `;
  db.query(sql, [postId], callback);
};

// Delete all media for an artwork post
const deleteArtworkMediaByPostId = (postId, callback) => {
  const sql = `
    DELETE FROM artwork_media
    WHERE post_id = ?
  `;
  db.query(sql, [postId], callback);
};

module.exports = {
  addArtworkMedia,
  getArtworkMediaByPostId,
  deleteArtworkMediaByPostId,
};