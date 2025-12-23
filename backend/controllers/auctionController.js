const auctionModels = require("../models/auctionModels");
const notificationsModels = require("../models/notificationsModels");

// Helper to send notification
const sendNotification = (userId, message) => {
  console.log("sendNotification triggered for:", userId, message);

  notificationsModels.createNotification(userId, message, (err) => {
    if (err) {
      console.error("Error creating notification:", err);
    } else {
      console.log("✅ Notification inserted successfully");
    }
  });
};

// Create auction (Starts as 'draft' - requires payment first)
const createAuction = (req, res) => {
  const { title, description, starting_price, auction_start_time, auction_duration_hours } = req.body;
  const author_id = req.user.id;
  
  // DEBUG: Log what we're receiving
  console.log("🟡 [CREATE AUCTION] Request body:", req.body);
  console.log("🟡 [CREATE AUCTION] auction_start_time from form:", auction_start_time);
  console.log("🟡 [CREATE AUCTION] auction_duration_hours:", auction_duration_hours);

  // UPDATED: Status starts as 'draft', no payment_status or payment_amount
  const status = "draft";
  const payment_id = null; // No payment ID initially

  if (!title || !description || !starting_price || !auction_start_time) {
    console.log("❌ Missing fields:", { title, description, starting_price, auction_start_time });
    return res.status(400).json({ 
      message: "Title, description, starting price, and auction start time are required." 
    });
  }

  // Validate auction start time is in the future
  const startTime = new Date(auction_start_time);
  const now = new Date();
  
  console.log("🟡 Start time parsed:", startTime);
  console.log("🟡 Current time:", now);
  
  if (startTime <= now) {
    return res.status(400).json({ 
      message: "Auction start time must be in the future." 
    });
  }

  // Validate duration (minimum 0.25 hours = 15 minutes)
  const durationHours = auction_duration_hours || 24;
if (durationHours < 0.0833) {  // Changed from 0.25 to 0.0833
  return res.status(400).json({ 
    message: "Minimum auction duration is 5 minutes (0.0833 hours)." 
  });
}
  if (durationHours > 720) {
  return res.status(400).json({ 
    message: "Maximum auction duration is 720 hours (30 days)." 
  });
}

  // Calculate end_time based on start_time + duration
  const endTime = new Date(startTime.getTime() + (durationHours * 60 * 60 * 1000));

  console.log("🟡 Calculated end time:", endTime);
  console.log("🟡 Duration hours:", durationHours);

  // UPDATED: Remove payment_status and payment_amount from auctionData
  const auctionData = {
    author_id,
    title,
    description,
    starting_price,
    current_price: starting_price,
    end_time: endTime, // This is when auction ends (start_time + duration)
    auction_start_time: startTime, // This is when auction starts
    auction_duration_hours: durationHours,
    status, // Should be "draft"
    payment_id // Will be null initially
  };

  console.log("🟡 Final auction data:", auctionData);

  auctionModels.createAuction(auctionData, (err, result) => {
    if (err) {
      console.error("❌ Error creating auction:", err);
      return res.status(500).json({ message: "Database error.", error: err });
    }

    const auctionId = result.insertId;

    console.log("✅ Auction created with ID:", auctionId);
    console.log("✅ Auction status:", status);

    // Notify user to make payment
    sendNotification(author_id, 
      `Your auction "${title}" is created. Please pay ₱100 to submit it for approval. Check your auctions to proceed with payment.`
    );

    res.status(201).json({
      message: "Auction created successfully. Please pay ₱100 to submit for approval.",
      auctionId: auctionId,
      paymentRequired: true,
      amount: 100.00, // Fixed amount for auction creation
      auctionStatus: status, // This is "draft"
      nextStep: "Make payment to proceed"
    });
  });
};

const getAuctionsByUserId = (req, res) => {
  const { userId } = req.params;

  console.log("🟡 Fetching ALL auctions for user ID:", userId);

  auctionModels.getAuctionsByAuthorId(userId, (err, results) => {
    if (err) {
      console.error("Error fetching user auctions:", err);
      return res.status(500).json({ message: "Database error.", error: err });
    }

    console.log("✅ Found", results.length, "auctions for user", userId);
    res.status(200).json(results);
  });
};


// Activate scheduled auctions (to be called by cron job)
const activateScheduledAuctions = () => {
  console.log("🕐 Checking for scheduled auctions to activate...");

  auctionModels.getAuctionsToActivate((err, results) => {
    if (err) {
      console.error("Error fetching auctions to activate:", err);
      return;
    }

    if (results.length === 0) {
      console.log("No scheduled auctions to activate at this time.");
      return;
    }

    results.forEach((auction) => {
      console.log(`⏰ Activating scheduled auction ID: ${auction.id} - "${auction.title}"`);
      
      auctionModels.updateAuctionStatus(auction.id, "active", (err) => {
        if (err) {
          console.error(`Failed to activate auction ${auction.id}:`, err);
          return;
        }

        console.log(`✅ Auction ${auction.id} activated and is now live!`);
        
        // Notify the auction creator
        sendNotification(
          auction.author_id,
          `Your auction "${auction.title}" is now LIVE! The bidding has started.`
        );

        // Notify followers (you can implement this later)
        console.log(`📢 Auction ${auction.id} is now active and visible to all users.`);
      });
    });
  });
};

// Admin-only: Get all auctions (with role control)
const getAllAuctions = (req, res) => {
  console.log("🟡 [CONTROLLER] Fetching all auctions for admin...");
  console.log("🟡 Admin role:", req.admin ? req.admin.role : "No admin");
  
  auctionModels.getAllAuctions((err, results) => {
    if (err) {
      console.error("❌ [CONTROLLER] Database error:", err);
      console.error("❌ [CONTROLLER] Full error object:", JSON.stringify(err, null, 2));
      return res.status(500).json({ 
        message: "Database error in getAllAuctions", 
        error: err.message,
        sqlError: err.sqlMessage,
        code: err.code
      });
    }

    console.log("✅ [CONTROLLER] Query successful, returning", results.length, "auctions");
    
    // For super_admin, return all auctions
    if (req.admin && req.admin.role === "super_admin") {
      return res.status(200).json(results);
    }

    // For regular admin, filter out sensitive data
    const filteredResults = results.filter(
      (auction) =>
        auction.status === "approved" ||
        auction.status === "active" ||
        auction.status === "rejected"
    );

    console.log("✅ [CONTROLLER] Filtered to", filteredResults.length, "auctions for admin");
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

// Get auctions sold by logged-in user (Seller's perspective)
const getSoldAuctions = (req, res) => {
  const sellerId = req.user.id;
  console.log("🟡 Fetching sold auctions for seller:", sellerId);

  auctionModels.getAuctionsSoldByUser(sellerId, (err, results) => {
    if (err) {
      console.error("Error fetching sold auctions:", err);
      return res.status(500).json({ message: "Database error.", error: err });
    }

    console.log("✅ Found sold auctions:", results.length);
    res.status(200).json(results);
  });
};

// Get auctions won by the logged-in user
const getAuctionsWonByUser = (req, res) => {
  const userId = req.user.id;
  console.log("🟡 Fetching auctions won by user:", userId);

  auctionModels.getAuctionsWonByUser(userId, (err, results) => {
    if (err) {
      console.error("Error fetching won auctions:", err);
      return res.status(500).json({ message: "Database error.", error: err });
    }

    console.log("✅ Found won auctions:", results.length);
    res.status(200).json(results);
  });
};

// Buyer confirms payment to admin (GCash)
const confirmPayment = (req, res) => {
  const { auctionId } = req.params;
  const buyerId = req.user.id;

  // First, verify that this user is the actual winner of this auction
  auctionModels.getAuctionById(auctionId, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error.", error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Auction not found." });
    }

    const auction = results[0];

    // Check if the current user is the winner
    if (auction.winner_id !== buyerId) {
      return res.status(403).json({ message: "You are not the winner of this auction." });
    }

    // Check if auction is in the right status for payment
    if (auction.escrow_status !== 'pending_payment') {
      return res.status(400).json({ message: "Payment cannot be confirmed at this time." });
    }

    // Update escrow status to 'paid'
    auctionModels.updateEscrowStatus(auctionId, 'paid', (err) => {
      if (err) {
        return res.status(500).json({ message: "Database error.", error: err });
      }

      // Notify the seller that payment has been made
      sendNotification(
        auction.author_id,
        `Payment has been made for your auction "${auction.title}". Please wait for the buyer to confirm receipt.`
      );

      // Notify admin (you) that payment is confirmed
      console.log(`🟡 ADMIN ALERT: Payment confirmed for auction ${auctionId} by user ${buyerId}`);

      res.status(200).json({ message: "Payment confirmed successfully. Please wait for the seller to ship your item." });
    });
  });
};

// Buyer confirms they received the item
const confirmItemReceived = (req, res) => {
  const { auctionId } = req.params;
  const buyerId = req.user.id;

  // Verify that this user is the winner
  auctionModels.getAuctionById(auctionId, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error.", error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Auction not found." });
    }

    const auction = results[0];

    // Check if the current user is the winner
    if (auction.winner_id !== buyerId) {
      return res.status(403).json({ message: "You are not the winner of this auction." });
    }

    // Check if auction is in 'paid' status
    if (auction.escrow_status !== 'paid') {
      return res.status(400).json({ message: "Item receipt cannot be confirmed at this time." });
    }

    // Update escrow status to 'item_received'
    auctionModels.updateEscrowStatus(auctionId, 'item_received', (err) => {
      if (err) {
        return res.status(500).json({ message: "Database error.", error: err });
      }

      // Notify the seller that item was received
      sendNotification(
        auction.author_id,
        `The buyer has confirmed receiving "${auction.title}". Payment will be released to you shortly.`
      );

      // Notify admin (you) to release payment to seller
      console.log(`🟢 ADMIN ALERT: Item received confirmed for auction ${auctionId}. Release payment to seller ${auction.author_id}`);

      res.status(200).json({ message: "Item receipt confirmed. Payment will be released to the seller soon." });
    });
  });
};

// Admin rejects payment claim
const rejectPayment = (req, res) => {
  const { auctionId } = req.params;

  if (!req.admin || req.admin.role !== "super_admin") {
    return res.status(403).json({ message: "Forbidden: Admin privileges required." });
  }

  auctionModels.getAuctionById(auctionId, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error.", error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Auction not found." });
    }

    const auction = results[0];

    // Update escrow status to 'payment_rejected'
    auctionModels.updateEscrowStatus(auctionId, 'payment_rejected', (err) => {
      if (err) {
        return res.status(500).json({ message: "Database error.", error: err });
      }

      // Notify the buyer
      sendNotification(
        auction.winner_id,
        `Payment for auction "${auction.title}" was not confirmed. Please check if payment was sent correctly or contact support.`
      );

      res.status(200).json({ message: "Payment rejected. Buyer has been notified." });
    });
  });
};

// Admin confirms payment manually
const adminConfirmPayment = (req, res) => {
  const { auctionId } = req.params;

  if (!req.admin || req.admin.role !== "super_admin") {
    return res.status(403).json({ message: "Forbidden: Admin privileges required." });
  }

  auctionModels.updateEscrowStatus(auctionId, 'paid', (err) => {
    if (err) {
      return res.status(500).json({ message: "Database error.", error: err });
    }

    // Notify seller
    auctionModels.getAuctionById(auctionId, (err, results) => {
      if (!err && results.length > 0) {
        const auction = results[0];
        sendNotification(
          auction.author_id,
          `Payment for your auction "${auction.title}" has been confirmed by Illura. Please ship the item.`
        );
      }
    });

    res.status(200).json({ message: "Payment confirmed manually." });
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
              console.log(`🏆 Top bid: ₱${topBid.bid_amount} by @${topBid.username}`);

              // Notify auction author
              sendNotification(
                auction.author_id,
                `Your auction "${auction.title}" has ended. Highest bidder: @${topBid.username} with ₱${topBid.bid_amount}.`
              );

              // Notify winning bidder
              sendNotification(
                topBid.bidder_id,
                `You won the auction for "${auction.title}" with a bid of ₱${topBid.bid_amount}. Check your Auction Wins section to proceed with payment.`
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

// NEW: Upload payment receipt (Buyer uploads GCash receipt)
const uploadPaymentReceipt = (req, res) => {
  const { auctionId } = req.params;
  const buyerId = req.user.id;

  if (!req.file) {
    return res.status(400).json({ message: "No receipt file uploaded." });
  }

  // Verify that this user is the winner of this auction
  auctionModels.getAuctionById(auctionId, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error.", error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Auction not found." });
    }

    const auction = results[0];

    // Check if the current user is the winner
    if (auction.winner_id !== buyerId) {
      return res.status(403).json({ message: "You are not the winner of this auction." });
    }

    // Check if auction is in the right status for receipt upload
    if (auction.escrow_status !== 'pending_payment') {
      return res.status(400).json({ 
        message: "Receipt cannot be uploaded at this time. Current status: " + auction.escrow_status 
      });
    }

    const receiptPath = req.file.filename;

    // Update auction with receipt path
    auctionModels.updatePaymentReceipt(auctionId, receiptPath, (err) => {
      if (err) {
        return res.status(500).json({ message: "Database error.", error: err });
      }

      // Notify admin that receipt has been uploaded
      console.log(`🟡 ADMIN ALERT: Payment receipt uploaded for auction ${auctionId} by user ${buyerId}`);
      console.log(`🟡 Receipt path: ${receiptPath}`);

      // Notify the buyer
      sendNotification(
        buyerId,
        `Your payment receipt for "${auction.title}" has been uploaded successfully. Please wait for Illura to verify.`
      );

      res.status(200).json({ 
        message: "Payment receipt uploaded successfully. Please wait for Illura verification.",
        receiptPath: receiptPath
      });
    });
  });
};

// NEW: Admin verifies payment receipt
const verifyPaymentReceipt = (req, res) => {
  const { auctionId } = req.params;

  if (!req.admin || req.admin.role !== "super_admin") {
    return res.status(403).json({ message: "Forbidden: Super Admin privileges required." });
  }

  // Verify auction exists and has receipt
  auctionModels.getAuctionById(auctionId, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error.", error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Auction not found." });
    }

    const auction = results[0];

    if (!auction.payment_receipt_path) {
      return res.status(400).json({ message: "No payment receipt found for this auction." });
    }

    // Mark receipt as verified and update escrow status to 'paid'
    auctionModels.verifyPaymentReceipt(auctionId, (err) => {
      if (err) {
        return res.status(500).json({ message: "Database error.", error: err });
      }

      // Update escrow status to 'paid'
      auctionModels.updateEscrowStatus(auctionId, 'paid', (err) => {
        if (err) {
          console.error("Error updating escrow status:", err);
        }

        // Notify seller that payment has been verified
        sendNotification(
          auction.author_id,
          `Payment receipt for your auction "${auction.title}" has been verified by Illura. Please ship the item to the buyer.`
        );

        // Notify buyer
        sendNotification(
          auction.winner_id,
          `Your payment receipt for "${auction.title}" has been verified! The seller will now ship your item.`
        );

        res.status(200).json({ 
          message: "Payment receipt verified successfully. Escrow status updated to 'paid'.",
          receiptVerified: true
        });
      });
    });
  });
};

// NEW: Admin rejects payment receipt
const rejectPaymentReceipt = (req, res) => {
  const { auctionId } = req.params;
  const { reason } = req.body;

  if (!req.admin || req.admin.role !== "super_admin") {
    return res.status(403).json({ message: "Forbidden: Super Admin privileges required." });
  }

  if (!reason) {
    return res.status(400).json({ message: "Rejection reason is required." });
  }

  auctionModels.getAuctionById(auctionId, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error.", error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Auction not found." });
    }

    const auction = results[0];

    // Update escrow status to 'payment_rejected'
    auctionModels.updateEscrowStatus(auctionId, 'payment_rejected', (err) => {
      if (err) {
        return res.status(500).json({ message: "Database error.", error: err });
      }

      // Notify buyer with rejection reason
      sendNotification(
        auction.winner_id,
        `Your payment receipt for "${auction.title}" was rejected. Reason: ${reason}. Please upload a valid receipt.`
      );

      res.status(200).json({ 
        message: "Payment receipt rejected. Buyer has been notified.",
        rejectionReason: reason
      });
    });
  });
};

// NEW: Admin uploads release receipt (when paying seller)
const uploadReleaseReceipt = (req, res) => {
  const { auctionId } = req.params;

  if (!req.admin || req.admin.role !== "super_admin") {
    return res.status(403).json({ message: "Forbidden: Super Admin privileges required." });
  }

  if (!req.file) {
    return res.status(400).json({ message: "No release receipt file uploaded." });
  }

  auctionModels.getAuctionById(auctionId, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error.", error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Auction not found." });
    }

    const auction = results[0];

    // Check if escrow is in 'item_received' or 'completed' status
    if (auction.escrow_status !== 'item_received' && auction.escrow_status !== 'completed') {
      return res.status(400).json({ 
        message: "Cannot upload release receipt. Current escrow status: " + auction.escrow_status 
      });
    }

    const receiptPath = req.file.filename;

    // Update auction with release receipt
    auctionModels.updateReleaseReceipt(auctionId, receiptPath, (err) => {
      if (err) {
        return res.status(500).json({ message: "Database error.", error: err });
      }

      // If escrow is not yet completed, mark it as completed
      if (auction.escrow_status !== 'completed') {
        auctionModels.updateEscrowStatus(auctionId, 'completed', (err) => {
          if (err) {
            console.error("Error updating escrow status:", err);
          }
        });
      }

      // Notify seller
      sendNotification(
        auction.author_id,
        `Payment of ₱${auction.final_price} for your auction "${auction.title}" has been released. Check your sold auctions for the receipt.`
      );

      console.log(`✅ Release receipt uploaded for auction ${auctionId}: ${receiptPath}`);

      res.status(200).json({ 
        message: "Release receipt uploaded successfully. Seller has been notified.",
        receiptPath: receiptPath
      });
    });
  });
};

// MODIFIED: Update releasePaymentToSeller to optionally accept receipt
const releasePaymentToSeller = (req, res) => {
  const { auctionId } = req.params;

  if (!req.admin || req.admin.role !== "super_admin") {
    return res.status(403).json({ message: "Forbidden: Admin privileges required." });
  }

  auctionModels.getAuctionById(auctionId, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error.", error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Auction not found." });
    }

    const auction = results[0];

    // Check if item has been received by buyer
    if (auction.escrow_status !== 'item_received') {
      return res.status(400).json({ message: "Cannot release payment until buyer confirms item receipt." });
    }

    // Check if receipt was uploaded with the request
    if (req.file) {
      const receiptPath = req.file.filename;
      
      // Update with release receipt
      auctionModels.updateReleaseReceipt(auctionId, receiptPath, (err) => {
        if (err) {
          return res.status(500).json({ message: "Database error.", error: err });
        }
        
        completePaymentRelease(auctionId, auction, receiptPath, res);
      });
    } else {
      // No receipt uploaded, just complete payment
      completePaymentRelease(auctionId, auction, null, res);
    }
  });
};

// Helper function for payment release
const completePaymentRelease = (auctionId, auction, receiptPath, res) => {
  // Update escrow status to 'completed'
  auctionModels.updateEscrowStatus(auctionId, 'completed', (err) => {
    if (err) {
      return res.status(500).json({ message: "Database error.", error: err });
    }

    // Notify seller that payment has been released
    const sellerMessage = receiptPath 
      ? `Payment of ₱${auction.final_price} for your auction "${auction.title}" has been released. Check your sold auctions for the receipt.`
      : `Payment of ₱${auction.final_price} for your auction "${auction.title}" has been released to your GCash account.`;
    
    sendNotification(auction.author_id, sellerMessage);

    // Notify buyer that transaction is complete
    sendNotification(
      auction.winner_id,
      `Transaction completed for "${auction.title}". Thank you for using Illura!`
    );

    const response = {
      message: "Payment released to seller successfully.",
      receiptUploaded: !!receiptPath
    };

    if (receiptPath) {
      response.receiptPath = receiptPath;
    }

    res.status(200).json(response);
  });
};

module.exports = {
  createAuction,
  getAllAuctions,
  getAllAuctionsPublic,
  getAuctionById,
  updateAuctionStatus,
  deleteAuction,
  getUserAuctions,
  getSoldAuctions,
  getAuctionsWonByUser,
  confirmPayment,
  confirmItemReceived,
  releasePaymentToSeller,
  rejectPayment,
  adminConfirmPayment,
  checkAndEndAuctions,
  activateScheduledAuctions,
  getAuctionsByUserId,
  uploadPaymentReceipt,
  verifyPaymentReceipt,
  rejectPaymentReceipt,
  uploadReleaseReceipt,
};