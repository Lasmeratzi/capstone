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

/// Get auctions where user has placed bids (regardless of winning) - UNIQUE AUCTIONS
const getAuctionsUserParticipatedIn = (userId, callback) => {
  const sql = `
    SELECT 
      a.*,
      u.username AS author_username,
      u.fullname AS author_fullname,
      u.pfp AS author_pfp,
      MAX(ab.bid_amount) AS user_bid_amount,  -- Get user's highest bid for this auction
      MAX(ab.created_at) AS user_latest_bid_time,  -- Get most recent bid time
      (
        SELECT MAX(bid_amount) 
        FROM auction_bids 
        WHERE auction_id = a.id
      ) AS current_highest_bid,
      (
        SELECT COUNT(*) 
        FROM auction_bids 
        WHERE auction_id = a.id
      ) AS total_bids,
      (
        SELECT COUNT(DISTINCT bidder_id) 
        FROM auction_bids 
        WHERE auction_id = a.id
      ) AS unique_bidders,
      -- Add winner info if auction has ended
      w.username AS winner_username,
      w.fullname AS winner_fullname
    FROM auctions a
    JOIN auction_bids ab ON a.id = ab.auction_id
    JOIN users u ON a.author_id = u.id
    LEFT JOIN users w ON a.winner_id = w.id
    WHERE ab.bidder_id = ?
    AND a.status IN ('active', 'ended')
    GROUP BY a.id, a.title, a.description, a.starting_price, a.current_price, 
             a.end_time, a.auction_start_time, a.auction_duration_hours, a.status, 
             a.created_at, a.author_id, a.winner_id, a.final_price, a.escrow_status,
             u.username, u.fullname, u.pfp, w.username, w.fullname
    ORDER BY MAX(ab.created_at) DESC
  `;
  
  console.log("🔍 [MODEL] Fetching UNIQUE auctions participated in by user:", userId);
  
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("❌ [MODEL] Database error in getAuctionsUserParticipatedIn:", err);
      console.error("❌ [MODEL] SQL Message:", err.sqlMessage);
    } else {
      console.log("✅ [MODEL] Found", results.length, "UNIQUE auctions participated in by user", userId);
      if (results.length > 0) {
        console.log("✅ [MODEL] Sample data:", {
          id: results[0].id,
          title: results[0].title,
          user_bid_amount: results[0].user_bid_amount,
          current_highest_bid: results[0].current_highest_bid,
          total_bids: results[0].total_bids
        });
      }
    }
    callback(err, results);
  });
};

module.exports = {
  createBid,
  getBidsByAuctionId,
  getHighestBidByAuctionId,
  getAuctionsUserParticipatedIn,
};
