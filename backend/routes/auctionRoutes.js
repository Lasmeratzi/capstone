const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware"); // For users
const authenticateAdmin  = require("../middleware/authAdmin"); // For admins
const auctionController = require("../controllers/auctionController");

const router = express.Router();

// Create a new auction (Users create auctions, start as 'pending')
router.post("/auctions", authenticateToken, auctionController.createAuction);

// ✅ Public / user-accessible route — no auth needed or optional token
router.get("/auctions", auctionController.getAllAuctionsPublic);

// ✅ Admin-only route to get everything
router.get("/admin/auctions", authenticateAdmin, auctionController.getAllAuctions);

// Get auctions created by logged-in user
router.get("/auctions/user", authenticateToken, auctionController.getUserAuctions);

// Get single auction by ID
router.get("/auctions/:auctionId", authenticateToken, auctionController.getAuctionById);

// Update auction status (Super Admin / Admin)
router.put("/auctions/:auctionId/status", authenticateAdmin, auctionController.updateAuctionStatus);

// Delete auction
router.delete("/auctions/:auctionId", authenticateAdmin, auctionController.deleteAuction);

module.exports = router;
