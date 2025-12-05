// paymentRoutes.js
const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const authenticateAdmin = require("../middleware/authAdmin");
const paymentsController = require("../controllers/paymentsController");

const router = express.Router();

// User confirms they paid ₱100 for auction creation
router.post("/confirm-auction-payment", authenticateToken, paymentsController.confirmAuctionPayment);

// Get user's payment history
router.get("/history", authenticateToken, paymentsController.getUserPaymentHistory);

// Admin routes for payment management
router.get("/admin/pending", authenticateAdmin, paymentsController.getPendingPayments);
router.put("/admin/verify/:paymentId", authenticateAdmin, paymentsController.verifyPayment);

router.get("/admin/payment/:paymentId", authenticateAdmin, paymentsController.getPaymentById);

// Get payment details for a specific auction
router.get("/auction/:auctionId", authenticateToken, paymentsController.getAuctionPaymentDetails);
router.get("/auction/:auctionId/admin", authenticateAdmin, paymentsController.getAuctionPaymentDetails);

module.exports = router;  // ✅ Make sure this export exists