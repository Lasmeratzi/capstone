const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware"); // For users
const authenticateAdmin = require("../middleware/authAdmin"); // For admins
const auctionController = require("../controllers/auctionController");

const router = express.Router();

// Create a new auction (Users create auctions, start as 'pending_payment')
router.post("/auctions", authenticateToken, auctionController.createAuction);

router.get("/auctions/user/:userId", authenticateToken, auctionController.getAuctionsByUserId);

// ✅ Public / user-accessible route — no auth needed or optional token
router.get("/auctions", auctionController.getAllAuctionsPublic);

// Get auctions sold by logged-in user (Seller's perspective)
router.get("/auctions/sold", authenticateToken, auctionController.getSoldAuctions);

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

// ESCROW & AUCTION WINS ROUTES

// Get auctions won by the logged-in user
router.get("/won/auctions", authenticateToken, auctionController.getAuctionsWonByUser);

// Buyer confirms payment to admin (GCash)
router.post("/auction/:auctionId/confirm-payment", authenticateToken, auctionController.confirmPayment);

// Buyer confirms they received the item
router.post("/auction/:auctionId/confirm-receipt", authenticateToken, auctionController.confirmItemReceived);

// Admin releases payment to seller (Super Admin only)
router.post("/admin/auction/:auctionId/release-payment", authenticateAdmin, auctionController.releasePaymentToSeller);

module.exports = router;