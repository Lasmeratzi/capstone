const db = require("../config/database");

// Create a new auction (Starts as 'pending')
const createAuction = (auctionData, callback) => {
 const sql = `
  INSERT INTO auctions (
    author_id, title, description, starting_price, 
    use_increment, bid_increment,  
    current_price, end_time, auction_start_time, 
    auction_duration_hours, status, payment_id,
    portfolio_item_id
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;
  
  const { 
  author_id, title, description, starting_price, 
  use_increment, bid_increment,  // ADD THESE 2
  current_price, end_time, auction_start_time, auction_duration_hours,
  status, payment_id,
  portfolio_item_id
} = auctionData;
  
  console.log("🟡 [MODEL] Inserting auction with:", {
    status, auction_start_time, auction_duration_hours, payment_id
  });
  
db.query(sql, [
  author_id, title, description, starting_price, 
  use_increment || 0, bid_increment || 100.00,  // ADD THESE 2
  current_price, end_time, auction_start_time, auction_duration_hours,
  status, payment_id || null,
  portfolio_item_id || null
], callback);
};

// Get all auctions (statuses handled by controller filter)
const getAllAuctions = (callback) => {
  const sql = `
    SELECT 
      a.*,
      -- Seller information
      u.username AS author_username,
      u.fullname AS author_fullname,
      u.gcash_number AS author_gcash,
      u.pfp AS author_pfp,
      u.verified AS author_is_verified,
      -- Winner information
      w.username AS winner_username,
      w.fullname AS winner_fullname,
      w.gcash_number AS winner_gcash,
      w.pfp AS winner_pfp,
      -- Payment information via JOIN
      p.status AS payment_status,
      p.amount AS payment_amount
    FROM auctions a
    JOIN users u ON a.author_id = u.id
    LEFT JOIN users w ON a.winner_id = w.id
    LEFT JOIN payments p ON a.payment_id = p.id
    ORDER BY a.created_at DESC
  `;
  
  console.log("🔍 SQL Query for getAllAuctions:", sql);
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ SQL Error in getAllAuctions:", err);
      console.error("❌ SQL Message:", err.sqlMessage);
      console.error("❌ SQL Code:", err.code);
      console.error("❌ Full error:", err);
    } else {
      console.log("✅ Query successful, found", results.length, "auctions");
    }
    callback(err, results);
  });
};

const updateAuctionPaymentId = (auctionId, paymentId, callback) => {
  const sql = `UPDATE auctions SET payment_id = ? WHERE id = ?`;
  db.query(sql, [paymentId, auctionId], callback);
};

// Get a single auction by ID
const getAuctionById = (auctionId, callback) => {
  const sql = `
    SELECT 
      auctions.*,
      users.username AS author_username,
      users.fullname AS author_fullname,
      users.pfp AS author_pfp,
      winner.username AS winner_username,
      winner.fullname AS winner_fullname,
      winner.pfp AS winner_pfp,
      winner.gcash_number AS winner_gcash
    FROM auctions
    JOIN users ON auctions.author_id = users.id
    LEFT JOIN users winner ON auctions.winner_id = winner.id
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
      users.pfp AS author_pfp,
      winner.username AS winner_username,
      winner.fullname AS winner_fullname,
      winner.pfp AS winner_pfp
    FROM auctions
    JOIN users ON auctions.author_id = users.id
    LEFT JOIN users winner ON auctions.winner_id = winner.id
    WHERE auctions.author_id = ?
    ORDER BY auctions.created_at DESC
  `;
  
  db.query(sql, [authorId], (err, results) => {
    if (err) {
      console.error("❌ SQL Error in getAuctionsByAuthorId:", err);
      console.error("❌ SQL Message:", err.sqlMessage);
      console.error("❌ SQL Code:", err.code);
    } else {
      console.log("✅ getAuctionsByAuthorId successful, found", results.length, "auctions");
      console.log("✅ Sample auction data:", results[0] ? {
        id: results[0].id,
        title: results[0].title,
        winner_id: results[0].winner_id,
        winner_username: results[0].winner_username,
        winner_pfp: results[0].winner_pfp
      } : "No results");
    }
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

// Get auctions won by a specific user
const getAuctionsWonByUser = (userId, callback) => {
  const sql = `
    SELECT 
      a.*, 
      u.username AS seller_username,
      u.fullname AS seller_fullname,
      u.gcash_number AS seller_gcash,
      am.media_path
    FROM auctions a
    LEFT JOIN users u ON a.author_id = u.id
    LEFT JOIN auction_media am ON a.id = am.auction_id
    WHERE a.winner_id = ? AND a.status = 'ended'
    ORDER BY a.created_at DESC
  `;
  db.query(sql, [userId], callback);
};

// Get auctions sold by a specific user (seller's perspective)
const getAuctionsSoldByUser = (sellerId, callback) => {
  const sql = `
    SELECT 
      a.*, 
      winner.username AS winner_username,
      winner.fullname AS winner_fullname,
      winner.gcash_number AS winner_gcash,
      am.media_path
    FROM auctions a
    LEFT JOIN users winner ON a.winner_id = winner.id
    LEFT JOIN auction_media am ON a.id = am.auction_id
    WHERE a.author_id = ? AND a.status = 'ended' AND a.winner_id IS NOT NULL
    ORDER BY a.created_at DESC
  `;
  db.query(sql, [sellerId], callback);
};

// Update auction winner and final price when auction ends
const setAuctionWinner = (auctionId, winnerId, finalPrice, callback) => {
  const sql = `
    UPDATE auctions 
    SET winner_id = ?, final_price = ?, escrow_status = 'pending_payment' 
    WHERE id = ?
  `;
  db.query(sql, [winnerId, finalPrice, auctionId], callback);
};

// Update escrow status
const updateEscrowStatus = (auctionId, escrowStatus, callback) => {
  const sql = `
    UPDATE auctions SET escrow_status = ? WHERE id = ?
  `;
  db.query(sql, [escrowStatus, auctionId], callback);
};

// Get auction with winner details for admin
const getAuctionWithWinnerDetails = (auctionId, callback) => {
  const sql = `
    SELECT 
      a.*,
      seller.username AS seller_username,
      seller.gcash_number AS seller_gcash,
      seller.fullname AS seller_fullname,
      winner.username AS winner_username,
      winner.gcash_number AS winner_gcash,
      winner.fullname AS winner_fullname
    FROM auctions a
    LEFT JOIN users seller ON a.author_id = seller.id
    LEFT JOIN users winner ON a.winner_id = winner.id
    WHERE a.id = ?
  `;
  db.query(sql, [auctionId], callback);
};

const updateAuctionPaymentStatus = (auctionId, paymentStatus, callback) => {
  const sql = `UPDATE auctions SET payment_status = ? WHERE id = ?`;
  db.query(sql, [paymentStatus, auctionId], callback);
};

// Get auctions by payment status (for admin)
const getAuctionsByPaymentStatus = (paymentStatus, callback) => {
  const sql = `
    SELECT auctions.*,
           users.username AS author_username,
           users.fullname AS author_fullname
    FROM auctions
    JOIN users ON auctions.author_id = users.id
    WHERE auctions.payment_status = ?
    ORDER BY auctions.created_at DESC
  `;
  db.query(sql, [paymentStatus], callback);
};

// Activate auction (change status from approved to active when start_time is reached)
const activateScheduledAuctions = (callback) => {
  const sql = `
    UPDATE auctions 
    SET status = 'active'
    WHERE status = 'approved' 
      AND auction_start_time <= NOW()
      AND (auction_start_time IS NOT NULL)
  `;
  db.query(sql, callback);
};

// Get auctions that need to be activated (for cron job)
const getAuctionsToActivate = (callback) => {
  const sql = `
    SELECT * FROM auctions 
    WHERE status = 'approved' 
      AND auction_start_time <= NOW()
      AND (auction_start_time IS NOT NULL)
  `;
  db.query(sql, callback);
};

// Update auction with start time and duration
const updateAuctionSchedule = (auctionId, auctionStartTime, auctionDurationHours, callback) => {
  const sql = `
    UPDATE auctions 
    SET auction_start_time = ?, auction_duration_hours = ?
    WHERE id = ?
  `;
  db.query(sql, [auctionStartTime, auctionDurationHours, auctionId], callback);
};

// Get auction with payment details
const getAuctionWithPaymentDetails = (auctionId, callback) => {
  const sql = `
    SELECT a.*,
           u.username AS author_username,
           u.fullname AS author_fullname,
           p.status AS payment_record_status,
           p.paid_at AS payment_date
    FROM auctions a
    JOIN users u ON a.author_id = u.id
    LEFT JOIN payments p ON a.id = p.auction_id
    WHERE a.id = ?
  `;
  db.query(sql, [auctionId], callback);
};

// NEW: Update payment receipt path when buyer uploads receipt
const updatePaymentReceipt = (auctionId, receiptPath, callback) => {
  const sql = `
    UPDATE auctions 
    SET payment_receipt_path = ?, payment_receipt_verified = FALSE 
    WHERE id = ?
  `;
  db.query(sql, [receiptPath, auctionId], callback);
};

// NEW: Update release receipt path when admin pays seller
const updateReleaseReceipt = (auctionId, receiptPath, callback) => {
  const sql = `
    UPDATE auctions 
    SET release_receipt_path = ?, release_receipt_uploaded = TRUE 
    WHERE id = ?
  `;
  db.query(sql, [receiptPath, auctionId], callback);
};

// NEW: Verify payment receipt (admin marks as verified)
const verifyPaymentReceipt = (auctionId, callback) => {
  const sql = `
    UPDATE auctions 
    SET payment_receipt_verified = TRUE 
    WHERE id = ?
  `;
  db.query(sql, [auctionId], callback);
};

// NEW: Get auction with receipt details
const getAuctionWithReceipts = (auctionId, callback) => {
  const sql = `
    SELECT 
      a.*,
      u.username AS author_username,
      u.fullname AS author_fullname,
      u.gcash_number AS author_gcash,
      w.username AS winner_username,
      w.fullname AS winner_fullname,
      w.gcash_number AS winner_gcash
    FROM auctions a
    LEFT JOIN users u ON a.author_id = u.id
    LEFT JOIN users w ON a.winner_id = w.id
    WHERE a.id = ?
  `;
  db.query(sql, [auctionId], callback);
};

/// Get auctions user has participated in (placed bids)
const getAuctionsUserParticipatedIn = (userId, callback) => {
  const sql = `
    SELECT 
      a.*,
      u.username AS author_username,
      u.fullname AS author_fullname,
      u.pfp AS author_pfp,
      w.id AS winner_id,
      w.username AS winner_username,
      w.fullname AS winner_fullname,
      -- Get user's max bid for this auction
      (SELECT MAX(b2.bid_amount) 
       FROM auction_bids b2 
       WHERE b2.auction_id = a.id 
       AND b2.bidder_id = ?) AS user_bid_amount,
      -- Get current highest bid (any bidder)
      (SELECT MAX(b3.bid_amount) 
       FROM auction_bids b3 
       WHERE b3.auction_id = a.id) AS current_highest_bid,
      -- Get total bids count
      (SELECT COUNT(*) 
       FROM auction_bids b4 
       WHERE b4.auction_id = a.id) AS total_bids
    FROM auctions a
    INNER JOIN auction_bids b ON a.id = b.auction_id
    INNER JOIN users u ON a.author_id = u.id
    LEFT JOIN users w ON a.winner_id = w.id
    WHERE b.bidder_id = ?
    GROUP BY a.id, a.title, a.description, a.starting_price, a.current_bid, 
             a.current_price, a.start_date, a.end_date, a.status, a.art_image, 
             a.created_at, a.escrow_status, a.winner_id, u.username, u.fullname, 
             u.id, u.pfp, w.id, w.username, w.fullname
    ORDER BY a.end_date ASC
  `;
  
  console.log("🔍 [MODEL] Fetching auctions participated in by user:", userId);
  
  db.query(sql, [userId, userId], (err, results) => {
    if (err) {
      console.error("❌ [MODEL] Database error in getAuctionsUserParticipatedIn:", err);
      console.error("❌ [MODEL] SQL Message:", err.sqlMessage);
    } else {
      console.log("✅ [MODEL] Found", results.length, "auctions participated in by user", userId);
      if (results.length > 0) {
        console.log("✅ [MODEL] Sample data:", {
          id: results[0].id,
          title: results[0].title,
          user_bid_amount: results[0].user_bid_amount,
          current_highest_bid: results[0].current_highest_bid
        });
      }
    }
    callback(err, results);
  });
};

const getAuctionStats = (callback) => {
  const sql = `
    SELECT 
      -- Total counts
      COUNT(*) as totalAuctions,
      SUM(CASE WHEN status = 'active' AND end_time > NOW() THEN 1 ELSE 0 END) as activeAuctions,
      SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approvedAuctions,
      SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as draftAuctions,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pendingAuctions,
      SUM(CASE WHEN status = 'ended' THEN 1 ELSE 0 END) as endedAuctions,
      SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejectedAuctions,
      
      -- Escrow status counts
      SUM(CASE WHEN escrow_status = 'pending_payment' THEN 1 ELSE 0 END) as pendingPayment,
      SUM(CASE WHEN escrow_status = 'paid' THEN 1 ELSE 0 END) as paidAuctions,
      SUM(CASE WHEN escrow_status = 'item_received' THEN 1 ELSE 0 END) as itemReceived,
      SUM(CASE WHEN escrow_status = 'completed' THEN 1 ELSE 0 END) as completedAuctions,
      
      -- Financial stats (only for completed auctions)
      SUM(CASE WHEN status = 'ended' AND final_price IS NOT NULL THEN final_price ELSE 0 END) as totalRevenue,
      AVG(CASE WHEN status = 'ended' AND final_price IS NOT NULL THEN final_price ELSE NULL END) as avgFinalPrice,
      
      -- Recent activity
      SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) as recentAuctions,
      
      -- Auctions ending soon (within 24 hours)
      SUM(CASE WHEN status = 'active' AND end_time BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 24 HOUR) THEN 1 ELSE 0 END) as endingSoon
      
    FROM auctions
  `;
  
  console.log("🔍 [MODEL] Fetching auction statistics");
  console.log("🔍 [MODEL] SQL Query:", sql);
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ [MODEL] Error fetching auction stats:", err);
      console.error("❌ [MODEL] SQL Message:", err.sqlMessage);
      console.error("❌ [MODEL] SQL Code:", err.code);
      console.error("❌ [MODEL] Full error object:", err);
    } else {
      console.log("✅ [MODEL] Auction stats query successful");
      console.log("📊 [MODEL] Results length:", results.length);
      if (results.length > 0) {
        console.log("📊 [MODEL] First result:", results[0]);
      } else {
        console.log("📊 [MODEL] No results returned from query");
      }
    }
    callback(err, results);
  });
};

// Get recent auctions for activity feed
const getRecentAuctions = (limit = 10, callback) => {
  const sql = `
    SELECT 
      a.*,
      u.username as author_username,
      u.fullname as author_fullname,
      u.pfp as author_pfp,
      w.username as winner_username,
      w.fullname as winner_fullname
    FROM auctions a
    LEFT JOIN users u ON a.author_id = u.id
    LEFT JOIN users w ON a.winner_id = w.id
    ORDER BY a.created_at DESC
    LIMIT ?
  `;
  
  db.query(sql, [limit], callback);
};

const updatePortfolioAuctionId = (portfolioItemId, auctionId, callback) => {
  const sql = `
    UPDATE portfolio_items 
    SET auction_id = ? 
    WHERE id = ?
  `;
  db.query(sql, [auctionId, portfolioItemId], callback);
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
  getAuctionsWonByUser,
  getAuctionsSoldByUser,
  setAuctionWinner,
  updateEscrowStatus,
  getAuctionWithWinnerDetails,
  updateAuctionPaymentId,
  activateScheduledAuctions,
  getAuctionsToActivate,
  updateAuctionSchedule,
  getAuctionWithPaymentDetails,
   updatePaymentReceipt,
  updateReleaseReceipt,
  verifyPaymentReceipt,
  getAuctionWithReceipts,
  getAuctionsUserParticipatedIn,
  getAuctionStats,
  getRecentAuctions,
  updatePortfolioAuctionId,
};