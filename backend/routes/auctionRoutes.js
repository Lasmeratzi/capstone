const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const auctionController = require("../controllers/auctionController");

const router = express.Router();

// Create a new auction
router.post("/auctions", authenticateToken, auctionController.createAuction);

// Get all auctions
router.get("/auctions", authenticateToken, auctionController.getAllAuctions);

// Get single auction by ID
router.get("/auctions/:auctionId", authenticateToken, auctionController.getAuctionById);

// Update auction status
router.put("/auctions/:auctionId/status", authenticateToken, auctionController.updateAuctionStatus);

// Delete auction
router.delete("/auctions/:auctionId", authenticateToken, auctionController.deleteAuction);

module.exports = router;
