const auctionbidsModels = require("../models/auctionbidsModels");
const auctionModels = require("../models/auctionModels");

// ✅ Place a bid on an auction
const placeBid = (req, res) => {
  console.log("🔹 Bid request received:", req.body); // Debugging log

  const bidder_id = req.user?.id; // Ensure bidder_id is valid
  const { auction_id, bid_amount } = req.body;

  if (!auction_id || !bid_amount || !bidder_id) {
    return res.status(400).json({ message: "Auction ID, bid amount, and user authentication are required." });
  }

  // ✅ Validate bid amount
  const bidValue = parseFloat(bid_amount);
  if (isNaN(bidValue) || bidValue <= 0) {
    return res.status(400).json({ message: "Bid amount must be a positive number." });
  }

  console.log(`🔹 Validating auction ${auction_id}...`);

  // ✅ Step 1: Validate auction existence & get price details
  auctionModels.getAuctionById(auction_id, (err, auctionResult) => {
    if (err) {
      console.error("🔹 Database error fetching auction:", err);
      return res.status(500).json({ message: "Database error.", error: err });
    }

    if (auctionResult.length === 0) {
      return res.status(404).json({ message: "Auction not found." });
    }

    const auction = auctionResult[0];
    if (auction.status !== "active") {
      return res.status(400).json({ message: "Cannot place bid. Auction is not active." });
    }

    const currentPrice = parseFloat(auction.current_price);
    const startingPrice = parseFloat(auction.starting_price);

    console.log(`🔹 Current price: ${currentPrice}, Starting price: ${startingPrice}, Bid: ${bidValue}`);

    // ✅ Ensure bid amount is valid
    if (bidValue <= startingPrice) {
      return res.status(400).json({ message: `Bid must be higher than starting price: ${startingPrice}` });
    }
    if (bidValue <= currentPrice) {
      return res.status(400).json({ message: `Bid must be higher than current price: ${currentPrice}` });
    }

    console.log("🔹 Placing bid...");

    // ✅ Step 2: Insert new bid
    const bidData = { auction_id, bidder_id, bid_amount: bidValue };
    auctionbidsModels.createBid(bidData, (err, result) => {
      if (err) {
        console.error("🔹 Database error inserting bid:", err);
        return res.status(500).json({ message: "Database error.", error: err });
      }

      console.log("🔹 Bid successfully placed!");

      // ✅ Step 3: Update auction current price
      auctionModels.updateAuctionCurrentPrice(auction_id, bidValue, (err2) => {
        if (err2) {
          console.error("🔹 Failed to update auction current price:", err2);
          return res.status(500).json({ message: "Failed to update auction current price.", error: err2 });
        }

        res.status(201).json({ message: "Bid placed successfully.", bidAmount: bidValue });
      });
    });
  });
};

// ✅ Get all bids for an auction
const getBidsForAuction = (req, res) => {
  const { auctionId } = req.params;
  console.log(`🔹 Fetching bids for auction ${auctionId}...`);

  auctionbidsModels.getBidsByAuctionId(auctionId, (err, results) => {
    if (err) {
      console.error("🔹 Database error fetching bids:", err);
      return res.status(500).json({ message: "Database error.", error: err });
    }

    console.log("🔹 Bids fetched successfully:", results.length);
    res.status(200).json(results);
  });
};

// ✅ Get highest bid for an auction
const getHighestBidForAuction = (req, res) => {
  const { auctionId } = req.params;
  console.log(`🔹 Fetching highest bid for auction ${auctionId}...`);

  auctionbidsModels.getHighestBidByAuctionId(auctionId, (err, result) => {
    if (err) {
      console.error("🔹 Database error fetching highest bid:", err);
      return res.status(500).json({ message: "Database error.", error: err });
    }

    console.log("🔹 Highest bid found:", result.length > 0 ? result[0] : "No bids yet");
    res.status(200).json(result.length === 0 ? null : result[0]);
  });
};

module.exports = {
  placeBid,
  getBidsForAuction,
  getHighestBidForAuction,
};