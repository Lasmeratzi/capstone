const auctionbidsModels = require("../models/auctionbidsModels");
const auctionModels = require("../models/auctionModels");

// Place a bid on an auction
const placeBid = (req, res) => {
  const bidder_id = req.user.id;
  const { auction_id, bid_amount } = req.body;

  if (!auction_id || !bid_amount) {
    return res.status(400).json({ message: "Auction ID and bid amount are required." });
  }

  // Validate bid amount is a positive number
  const bidValue = parseFloat(bid_amount);
  if (isNaN(bidValue) || bidValue <= 0) {
    return res.status(400).json({ message: "Bid amount must be a positive number." });
  }

  // Step 1: Fetch the auction to validate it exists and get starting_price, current_price, status
  auctionModels.getAuctionById(auction_id, (err, auctionResult) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });

    if (auctionResult.length === 0) {
      return res.status(404).json({ message: "Auction not found." });
    }

    const auction = auctionResult[0];

    if (auction.status !== "active") {
      return res.status(400).json({ message: "Cannot place bid. Auction is not active." });
    }

    // Step 2: Check if bid_amount is greater than starting_price and current_price
    // If no bids yet, bid must be > starting_price
    // If bids exist, bid must be > current_price

    const currentPrice = parseFloat(auction.current_price);
    const startingPrice = parseFloat(auction.starting_price);

    if (bidValue <= startingPrice) {
      return res.status(400).json({ message: `Bid must be higher than starting price: ${startingPrice}` });
    }

    if (bidValue <= currentPrice) {
      return res.status(400).json({ message: `Bid must be higher than current price: ${currentPrice}` });
    }

    // Step 3: Insert new bid
    const bidData = {
      auction_id,
      bidder_id,
      bid_amount: bidValue,
    };

    auctionbidsModels.createBid(bidData, (err, result) => {
      if (err) return res.status(500).json({ message: "Database error.", error: err });

      // Step 4: Update auction current_price to new bid_amount
      auctionModels.updateAuctionCurrentPrice(auction_id, bidValue, (err2) => {
        if (err2) return res.status(500).json({ message: "Failed to update auction current price.", error: err2 });

        res.status(201).json({ message: "Bid placed successfully." });
      });
    });
  });
};

// Get all bids for an auction
const getBidsForAuction = (req, res) => {
  const { auctionId } = req.params;

  auctionbidsModels.getBidsByAuctionId(auctionId, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });

    res.status(200).json(results);
  });
};

module.exports = {
  placeBid,
  getBidsForAuction,
};
