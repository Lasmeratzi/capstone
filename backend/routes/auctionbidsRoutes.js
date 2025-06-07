const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const auctionbidsController = require("../controllers/auctionbidsController");

const router = express.Router();

// Place a bid on an auction
router.post("/auction-bids", authenticateToken, auctionbidsController.placeBid);

// Get all bids for a specific auction
router.get("/auction-bids/:auctionId", authenticateToken, auctionbidsController.getBidsForAuction);

module.exports = router;
