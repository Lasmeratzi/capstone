const db = require("../config/database");

// Create a new bid
const createBid = (bidData, callback) => {
  const sql = `
    INSERT INTO auction_bids (auction_id, bidder_id, bid_amount)
    VALUES (?, ?, ?)
  `;
  const { auction_id, bidder_id, bid_amount } = bidData;
  db.query(sql, [auction_id, bidder_id, bid_amount], callback);
};

// Get all bids for a specific auction ordered by bid_amount descending
const getBidsByAuctionId = (auctionId, callback) => {
  const sql = `
    SELECT 
  auction_bids.id AS id,
  auction_bids.*, 
  users.username AS bidder_username, 
  users.fullname AS bidder_fullname, 
  users.pfp AS bidder_pfp
FROM auction_bids
JOIN users ON auction_bids.bidder_id = users.id
WHERE auction_bids.auction_id = ?
ORDER BY auction_bids.bid_amount DESC, auction_bids.created_at ASC

  `;
  db.query(sql, [auctionId], callback);
};

// Get highest bid for a specific auction
const getHighestBidByAuctionId = (auctionId, callback) => {
  const query = `
    SELECT ab.id, ab.bid_amount, ab.created_at, u.username AS bidder_username, u.pfp AS bidder_pfp
    FROM auction_bids ab
    JOIN users u ON ab.bidder_id = u.id
    WHERE ab.auction_id = ?
    ORDER BY ab.bid_amount DESC
    LIMIT 1
  `;

  console.log("Executing SQL Query:", query); // Debugging Step

  db.query(query, [auctionId], (err, result) => {
    if (err) {
      console.error("Database query error:", err);
    } else {
      console.log("Database query result:", result);
    }
    callback(err, result);
  });
};

module.exports = {
  createBid,
  getBidsByAuctionId,
  getHighestBidByAuctionId,
};
