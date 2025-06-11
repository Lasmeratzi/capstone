const auctionModels = require("../models/auctionModels");
const notificationsModels = require("../models/notificationsModels");

// Helper to send notification
const sendNotification = (userId, message) => {
  console.log("sendNotification triggered for:", userId, message); // ← ADD THIS

  notificationsModels.createNotification(userId, message, (err) => {
    if (err) {
      console.error("Error creating notification:", err);
    } else {
      console.log("✅ Notification inserted successfully");
    }
  });
};


// Create auction (Starts as 'pending')
const createAuction = (req, res) => {
  const { title, description, starting_price, end_time } = req.body;
  const author_id = req.user.id;
  const status = "pending";

  if (!title || !description || !starting_price || !end_time) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const current_price = starting_price;

  const auctionData = {
    author_id,
    title,
    description,
    starting_price,
    current_price,
    end_time,
    status,
  };

  auctionModels.createAuction(auctionData, (err, result) => {
    if (err)
      return res.status(500).json({ message: "Database error.", error: err });

    // Notify user about auction pending approval
    sendNotification(author_id, `Your auction "${title}" has been created and is pending approval.`);

    res.status(201).json({
      message: "Auction created successfully.",
      auctionId: result.insertId,
    });
  });
};

// Admin-only: Get all auctions (with role control)
const getAllAuctions = (req, res) => {
  auctionModels.getAllAuctions((err, results) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });

    console.log("Admin Role:", req.admin ? req.admin.role : "No admin role detected");

    if (req.admin && req.admin.role === "super_admin") {
      return res.status(200).json(results);
    }

    const filteredResults = results.filter(
      (auction) =>
        auction.status === "approved" ||
        auction.status === "active" ||
        auction.status === "rejected"
    );

    res.status(200).json(filteredResults);
  });
};

// Public/User: Get only 'approved' and 'active' auctions
const getAllAuctionsPublic = (req, res) => {
  auctionModels.getAllAuctions((err, results) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });

    const visibleAuctions = results.filter(
      (auction) => auction.status === "approved" || auction.status === "active"
    );

    res.status(200).json(visibleAuctions);
  });
};

// Get single auction by ID
const getAuctionById = (req, res) => {
  const { auctionId } = req.params;

  auctionModels.getAuctionById(auctionId, (err, result) => {
    if (err)
      return res.status(500).json({ message: "Database error.", error: err });

    if (result.length === 0) {
      return res.status(404).json({ message: "Auction not found." });
    }

    res.status(200).json(result[0]);
  });
};

// Update auction status (Super Admin only)
const updateAuctionStatus = (req, res) => {
  const { auctionId } = req.params;
  const { status } = req.body;

  if (!req.admin || req.admin.role !== "super_admin") {
    return res.status(403).json({ message: "Forbidden: Admin privileges required." });
  }

  const allowedStatuses = ["pending", "approved", "active", "ended", "rejected", "stopped"];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value." });
  }

  auctionModels.updateAuctionStatus(auctionId, status, (err) => {
    if (err)
      return res.status(500).json({ message: "Database error.", error: err });

    // Fetch the auction to notify author
    auctionModels.getAuctionById(auctionId, (err, results) => {
      if (!err && results.length > 0) {
        const auction = results[0];
        sendNotification(auction.author_id, `Your auction "${auction.title}" status has been updated to "${status}".`);
      }
    });

    res.status(200).json({ message: "Auction status updated." });
  });
};

// Delete auction
const deleteAuction = (req, res) => {
  const { auctionId } = req.params;

  auctionModels.deleteAuction(auctionId, (err) => {
    if (err)
      return res.status(500).json({ message: "Database error.", error: err });

    res.status(200).json({ message: "Auction deleted successfully." });
  });
};

// Get auctions created by logged-in user
const getUserAuctions = (req, res) => {
  console.log("Received User ID:", req.user.id);
  const authorId = req.user.id;

  auctionModels.getAuctionsByAuthorId(authorId, (err, results) => {
    if (err)
      return res.status(500).json({ message: "Database error.", error: err });

    res.status(200).json(results);
  });
};

// Automatically end auctions when 'end_time' is reached
const checkAndEndAuctions = () => {
  console.log("🕑 Checking for expired auctions...");

  auctionModels.getAllAuctions((err, results) => {
    if (err) {
      console.error("Error fetching auctions:", err);
      return;
    }

    const now = new Date();

    results.forEach((auction) => {
      const auctionEndTime = new Date(auction.end_time);

      if (auction.status === "active" && auctionEndTime <= now) {
        console.log(`📦 Ending auction ID: ${auction.id}`);

        // End auction
        auctionModels.updateAuctionStatus(auction.id, "ended", (err) => {
          if (err) {
            console.error(`Failed to end auction ${auction.id}:`, err);
            return;
          }

          console.log(`✅ Auction ${auction.id} marked as 'ended'`);

          // Fetch highest bid for this auction
          auctionModels.getHighestBidForAuction(auction.id, (err, bids) => {
            if (err) {
              console.error("Error fetching top bid:", err);
              return;
            }

            if (bids.length > 0) {
              const topBid = bids[0];
              console.log(`🏆 Top bid: $${topBid.amount} by @${topBid.username}`);

              // Notify auction author
              sendNotification(
                auction.author_id,
                `Your auction "${auction.title}" has ended. Highest bidder: @${topBid.username} with $${topBid.amount}.`
              );

              // Notify winning bidder
              sendNotification(
                topBid.bidder_id, // not topBid.user_id
              `You won the auction for "${auction.title}" with a bid of ₱${topBid.bid_amount}.`
);
            } else {
              // No bids placed
              sendNotification(
                auction.author_id,
                `Your auction "${auction.title}" has ended with no bids placed.`
              );
            }
          });
        });
      }
    });
  });
};

module.exports = {
  createAuction,
  getAllAuctions,        // Admin-only
  getAllAuctionsPublic,  // User/Public
  getAuctionById,
  updateAuctionStatus,
  deleteAuction,
  getUserAuctions,
  checkAndEndAuctions,
};
