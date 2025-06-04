const db = require("../config/database");

// Create a new auction
const createAuction = (auctionData, callback) => {
  const sql = `
    INSERT INTO auctions (author_id, title, description, end_time, status)
    VALUES (?, ?, ?, ?, ?)
  `;
  const { author_id, title, description, end_time, status } = auctionData;
  db.query(sql, [author_id, title, description, end_time, status], callback);
};

// Get all auctions
const getAllAuctions = (callback) => {
  const sql = `
    SELECT * FROM auctions ORDER BY created_at DESC
  `;
  db.query(sql, callback);
};

// Get a single auction by ID
const getAuctionById = (auctionId, callback) => {
  const sql = `
    SELECT * FROM auctions WHERE id = ?
  `;
  db.query(sql, [auctionId], callback);
};

// Update auction status
const updateAuctionStatus = (auctionId, status, callback) => {
  const sql = `
    UPDATE auctions SET status = ? WHERE id = ?
  `;
  db.query(sql, [status, auctionId], callback);
};

// Delete an auction
const deleteAuction = (auctionId, callback) => {
  const sql = `
    DELETE FROM auctions WHERE id = ?
  `;
  db.query(sql, [auctionId], callback);
};

module.exports = {
  createAuction,
  getAllAuctions,
  getAuctionById,
  updateAuctionStatus,
  deleteAuction,
};
