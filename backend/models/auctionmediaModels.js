const db = require("../config/database");

// Insert media associated with an auction
const addAuctionMedia = (mediaData, callback) => {
  const sql = `
    INSERT INTO auction_media (auction_id, media_path)
    VALUES (?, ?)
  `;
  db.query(sql, [mediaData.auction_id, mediaData.media_path], callback);
};

// Get all media for a specific auction
const getAuctionMediaByAuctionId = (auctionId, callback) => {
  const sql = `
    SELECT id, media_path
    FROM auction_media
    WHERE auction_id = ?
    ORDER BY id ASC
  `;
  db.query(sql, [auctionId], callback);
};

// Delete all media for a specific auction
const deleteAuctionMediaByAuctionId = (auctionId, callback) => {
  const sql = `
    DELETE FROM auction_media
    WHERE auction_id = ?
  `;
  db.query(sql, [auctionId], callback);
};

module.exports = {
  addAuctionMedia,
  getAuctionMediaByAuctionId,
  deleteAuctionMediaByAuctionId,
};
