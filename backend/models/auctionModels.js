const db = require("../config/database");

// Create a new auction (Starts as 'pending')
const createAuction = (auctionData, callback) => {
  const sql = `
    INSERT INTO auctions (author_id, title, description, starting_price, current_price, end_time, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const { author_id, title, description, starting_price, current_price, end_time } = auctionData;
  const status = "pending"; // ✅ Auctions start as 'pending'
  db.query(sql, [author_id, title, description, starting_price, current_price, end_time, status], callback);
};

// Get all auctions (statuses handled by controller filter)
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
  
  db.query(sql, callback); // No filtering here — handled in controller
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

// Update auction status (supports 'pending', 'approved', 'active', 'ended', 'rejected')
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

// Update auction current price
const updateAuctionCurrentPrice = (auctionId, currentPrice, callback) => {
  const sql = `
    UPDATE auctions SET current_price = ? WHERE id = ?
  `;
  db.query(sql, [currentPrice, auctionId], callback);
};

// Get highest bid for a specific auction
const getHighestBidForAuction = (auctionId, callback) => {
  const sql = `
    SELECT b.*, u.username 
    FROM auction_bids b
    JOIN users u ON b.bidder_id = u.id
    WHERE b.auction_id = ?
    ORDER BY b.bid_amount DESC
    LIMIT 1
  `;
  db.query(sql, [auctionId], callback);
};



module.exports = {
  createAuction,
  getAllAuctions,
  getAuctionById,
  getAuctionsByAuthorId,
  getHighestBidForAuction,
  updateAuctionStatus,
  updateAuctionCurrentPrice,
  deleteAuction,
};
