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
    SELECT auction_bids.*, users.username AS bidder_username, users.fullname AS bidder_fullname, users.pfp AS bidder_pfp
    FROM auction_bids
    JOIN users ON auction_bids.bidder_id = users.id
    WHERE auction_bids.auction_id = ?
    ORDER BY auction_bids.bid_amount DESC, auction_bids.created_at ASC
  `;
  db.query(sql, [auctionId], callback);
};

// Get highest bid for a specific auction
const getHighestBidForAuction = (auctionId, callback) => {
  const sql = `
    SELECT MAX(bid_amount) AS highest_bid
    FROM auction_bids
    WHERE auction_id = ?
  `;
  db.query(sql, [auctionId], callback);
};

module.exports = {
  createBid,
  getBidsByAuctionId,
  getHighestBidForAuction,
};
