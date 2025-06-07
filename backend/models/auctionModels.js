const db = require("../config/database");

// Create a new auction
const createAuction = (auctionData, callback) => {
  const sql = `
    INSERT INTO auctions (author_id, title, description, starting_price, current_price, end_time, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const { author_id, title, description, starting_price, current_price, end_time, status } = auctionData;
  db.query(sql, [author_id, title, description, starting_price, current_price, end_time, status], callback);
};

// Get all auctions
const getAllAuctions = (callback) => {
  const sql = `
    SELECT 
      auctions.*,
      users.username AS author_username,
      users.fullname AS author_fullname,
      users.pfp AS author_pfp
    FROM auctions
    JOIN users ON auctions.author_id = users.id
    ORDER BY auctions.created_at DESC
  `;
  db.query(sql, callback);
};

// Get a single auction by ID
const getAuctionById = (auctionId, callback) => {
  const sql = `
    SELECT 
      auctions.*,
      users.username AS author_username,
      users.fullname AS author_fullname,
      users.pfp AS author_pfp
    FROM auctions
    JOIN users ON auctions.author_id = users.id
    WHERE auctions.id = ?
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

// Get auctions by author ID
const getAuctionsByAuthorId = (authorId, callback) => {
  const sql = `
    SELECT 
      auctions.*,
      users.username AS author_username,
      users.fullname AS author_fullname,
      users.pfp AS author_pfp
    FROM auctions
    JOIN users ON auctions.author_id = users.id
    WHERE auctions.author_id = ?
    ORDER BY auctions.created_at DESC
  `;
  db.query(sql, [authorId], (err, results) => {
    console.log("Filtered Auctions from DB:", results);
    callback(err, results);
  });
};

const updateAuctionCurrentPrice = (auctionId, currentPrice, callback) => {
  const sql = `
    UPDATE auctions SET current_price = ? WHERE id = ?
  `;
  db.query(sql, [currentPrice, auctionId], callback);
};

module.exports = {
  createAuction,
  getAllAuctions,
  getAuctionById,
  getAuctionsByAuthorId,
  updateAuctionStatus,
  updateAuctionCurrentPrice,
  deleteAuction,
};
