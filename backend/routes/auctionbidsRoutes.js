const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const auctionbidsController = require("../controllers/auctionbidsController");

const router = express.Router();

// Get all bids for a specific auction
router.get("/:auctionId", authenticateToken, auctionbidsController.getBidsForAuction);

// Get highest bid for an auction
router.get("/highest/:auctionId", authenticateToken, auctionbidsController.getHighestBidForAuction);

// Place a bid on an auction
router.post("/place-bid", authenticateToken, auctionbidsController.placeBid);

// Test route
router.get("/test", (req, res) => {
  res.send("Auction Bids API is working!");
});

module.exports = router;