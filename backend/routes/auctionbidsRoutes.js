const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const auctionbidsController = require("../controllers/auctionbidsController");

const router = express.Router();

// Place a bid on an auction
router.post("/place-bid", authenticateToken, auctionbidsController.placeBid);

// Get all bids for a specific auction
router.get("/auction-bids/:auctionId", authenticateToken, auctionbidsController.getBidsForAuction);

router.get("/highest/:auctionId", authenticateToken, auctionbidsController.getHighestBidForAuction);

router.get("/test", (req, res) => {
  res.send("Auction Bids API is working!");
});

module.exports = router;
