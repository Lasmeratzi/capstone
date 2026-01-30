const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware"); // For users
const authenticateAdmin = require("../middleware/authAdmin"); // For admins
const auctionController = require("../controllers/auctionController");
const upload = require("../middleware/uploadMiddleware"); // Import upload middleware

const router = express.Router();

// ========== DEBUG ==========
console.log("🔍 auctionRoutes.js is being loaded!");
console.log("🔍 Available controller methods:", Object.keys(auctionController));

// Add this debug route first
router.get("/debug-test", (req, res) => {
  console.log("✅ Debug route hit in auctionRoutes.js");
  res.json({ 
    message: "auctionRoutes.js is working",
    timestamp: new Date(),
    routes: [
      "/api/auctions/stats",
      "/api/auctions/activities/recent",
      "/api/auctions/test-public",
      "/api/auctions/test-simple"
    ]
  });
});

// ========== MAIN ROUTES ==========

// Create a new auction (Users create auctions, start as 'pending_payment')
router.post("/auctions", authenticateToken, auctionController.createAuction);

// ✅ Public / user-accessible route — no auth needed or optional token
router.get("/auctions", auctionController.getAllAuctionsPublic);

// ========== USER-SPECIFIC AUCTION ROUTES (STATIC) ==========
// These MUST come before dynamic routes like /auctions/:auctionId

// Get auctions created by logged-in user
router.get("/auctions/user", authenticateToken, auctionController.getUserAuctions);

// Get auctions sold by logged-in user (Seller's perspective)
router.get("/auctions/sold", authenticateToken, auctionController.getSoldAuctions);

// Get auctions user has participated in (placed bids)
router.get("/auctions/participated", authenticateToken, auctionController.getParticipatedAuctions);

// Get auctions for a specific user (with user ID parameter)
router.get("/auctions/user/:userId", authenticateToken, auctionController.getAuctionsByUserId);

// ========== AUCTION STATISTICS ROUTES ==========
// IMPORTANT: These must come BEFORE dynamic routes

// Get auction statistics for admin dashboard
router.get("/stats", authenticateAdmin, auctionController.getAuctionStats);

// Get recent auction activities for admin dashboard
router.get("/activities/recent", authenticateAdmin, auctionController.getRecentAuctionActivities);

// ========== ADMIN ROUTES ==========
router.get("/admin/auctions", authenticateAdmin, auctionController.getAllAuctions);

// ========== DYNAMIC ROUTES (MUST COME AFTER ALL STATIC ROUTES) ==========
// Get single auction by ID
router.get("/auctions/:auctionId", authenticateToken, auctionController.getAuctionById);

// Update auction status (Super Admin / Admin)
router.put("/auctions/:auctionId/status", authenticateAdmin, auctionController.updateAuctionStatus);

// Delete auction
router.delete("/auctions/:auctionId", authenticateAdmin, auctionController.deleteAuction);

// ========== ESCROW & AUCTION WINS ROUTES ==========

// Get auctions won by the logged-in user
router.get("/won/auctions", authenticateToken, auctionController.getAuctionsWonByUser);

// Buyer confirms payment to admin (GCash)
router.post("/auction/:auctionId/confirm-payment", authenticateToken, auctionController.confirmPayment);

// NEW: Buyer uploads payment receipt (GCash screenshot)
router.post(
  "/auction/:auctionId/upload-payment-receipt",
  authenticateToken,
  upload.single("receipt"), // 'receipt' is the field name in form-data
  auctionController.uploadPaymentReceipt
);

// Buyer confirms they received the item
router.post("/auction/:auctionId/confirm-receipt", authenticateToken, auctionController.confirmItemReceived);

// Admin releases payment to seller (Super Admin only)
router.post(
  "/admin/auction/:auctionId/release-payment",
  authenticateAdmin,
  upload.single("releaseReceipt"), // Optional: for release receipt upload
  auctionController.releasePaymentToSeller
);

// NEW: Admin verifies payment receipt
router.put(
  "/admin/auction/:auctionId/verify-receipt",
  authenticateAdmin,
  auctionController.verifyPaymentReceipt
);

// NEW: Admin rejects payment receipt
router.put(
  "/admin/auction/:auctionId/reject-receipt",
  authenticateAdmin,
  auctionController.rejectPaymentReceipt
);

// NEW: Admin uploads release receipt separately (alternative to including in release-payment)
router.post(
  "/admin/auction/:auctionId/upload-release-receipt",
  authenticateAdmin,
  upload.single("releaseReceipt"),
  auctionController.uploadReleaseReceipt
);

module.exports = router;