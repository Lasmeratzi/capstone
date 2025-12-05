const paymentsModels = require("../models/paymentsModels");
const auctionModels = require("../models/auctionModels");
const notificationsModels = require("../models/notificationsModels");

// Helper to send notification
const sendNotification = (userId, message) => {
  console.log("sendNotification triggered for:", userId, message);

  notificationsModels.createNotification(userId, message, (err) => {
    if (err) {
      console.error("Error creating notification:", err);
    } else {
      console.log("✅ Notification inserted successfully");
    }
  });
};

// User confirms they paid ₱100 for auction creation
const confirmAuctionPayment = (req, res) => {
  const { auctionId, paymentMethod, referenceNumber } = req.body;
  const payerId = req.user.id;

  // Validate required fields
  if (!auctionId || !paymentMethod) {
    return res.status(400).json({ 
      message: "Auction ID and payment method are required." 
    });
  }

  // First, check if auction exists and belongs to user
  auctionModels.getAuctionById(auctionId, (err, auctionResults) => {
    if (err) {
      return res.status(500).json({ message: "Database error.", error: err });
    }

    if (auctionResults.length === 0) {
      return res.status(404).json({ message: "Auction not found." });
    }

    const auction = auctionResults[0];

    // Check if auction belongs to the user
    if (auction.author_id !== payerId) {
      return res.status(403).json({ 
        message: "You are not the owner of this auction." 
      });
    }

    // Check if auction already has a payment (payment_id is set)
    if (auction.payment_id) {
      return res.status(400).json({ 
        message: "Payment for this auction is already confirmed." 
      });
    }

    // Check if auction is in draft status
    if (auction.status !== 'draft') {
      console.log("❌ Auction status is:", auction.status, "expected: draft");
      return res.status(400).json({ 
        message: `This auction is not in draft status. Current status: ${auction.status}` 
      });
    }

    // Create payment record
    const paymentData = {
      auction_id: auctionId,
      payer_id: payerId,
      amount: 100.00, // Fixed auction creation fee
      payment_method: paymentMethod,
      status: 'pending', // Starts as pending until admin verifies
      paid_at: new Date()
    };

    paymentsModels.createAuctionPayment(paymentData, (err, paymentResult) => {
      if (err) {
        return res.status(500).json({ message: "Database error.", error: err });
      }

      const paymentId = paymentResult.insertId;
      
      // UPDATED: Set payment_id in auctions table
      auctionModels.updateAuctionPaymentId(auctionId, paymentId, (err) => {
        if (err) {
          console.error("❌ Error updating auction payment_id:", err);
          return res.status(500).json({ message: "Database error.", error: err });
        }

        console.log(`✅ Updated auction ${auctionId} payment_id to ${paymentId}`);

        // Update auction status to 'pending' (waiting for admin approval)
        auctionModels.updateAuctionStatus(auctionId, 'pending', (err) => {
          if (err) {
            console.error("❌ Error updating auction status:", err);
            return res.status(500).json({ message: "Database error.", error: err });
          }

          console.log(`✅ Updated auction ${auctionId} status to 'pending'`);

          // Send notification to user
          sendNotification(payerId, 
            `Your ₱100 payment for auction "${auction.title}" has been recorded. Waiting for admin approval.`
          );

          // Send notification to all admins (simulated for thesis)
          console.log(`🟡 ADMIN ALERT: User ${payerId} confirmed payment for auction ${auctionId}. Please review in admin panel.`);

          res.status(200).json({
            message: "Payment confirmed! Your auction is now pending admin approval.",
            paymentId: paymentId,
            auctionStatus: 'pending'
          });
        });
      });
    });
  });
};

// Admin verifies a payment (changes status from pending to completed or failed)
const verifyPayment = (req, res) => {
  if (!req.admin || req.admin.role !== "super_admin") {
    return res.status(403).json({ 
      message: "Forbidden: Super Admin privileges required." 
    });
  }

  const { paymentId } = req.params;
  const { status } = req.body; // 'completed' or 'failed'

  if (!status || (status !== 'completed' && status !== 'failed')) {
    return res.status(400).json({ 
      message: "Invalid status. Must be 'completed' or 'failed'." 
    });
  }

  // First, get payment details to find auction ID
  paymentsModels.getPaymentById(paymentId, (err, paymentResults) => {
    if (err) {
      return res.status(500).json({ message: "Database error.", error: err });
    }

    if (paymentResults.length === 0) {
      return res.status(404).json({ message: "Payment not found." });
    }

    const payment = paymentResults[0];
    const auctionId = payment.auction_id;

    // Update payment status
    paymentsModels.updatePaymentStatus(paymentId, status, (err) => {
      if (err) {
        return res.status(500).json({ message: "Database error.", error: err });
      }

      // Send notification to user
      sendNotification(payment.payer_id, 
        status === 'completed' 
          ? `Your ₱${payment.amount} payment has been verified by Illura. Your auction is now approved!`
          : `Your ₱${payment.amount} payment was not verified. Please contact support.`
      );

      // If payment is completed, update auction status to 'approved'
      if (status === 'completed') {
        auctionModels.updateAuctionStatus(auctionId, 'approved', (err) => {
          if (err) {
            console.error("Error updating auction status:", err);
            return res.status(500).json({ message: "Database error.", error: err });
          }
          console.log(`✅ Auction ${auctionId} status updated to 'approved'`);
        });
      } else if (status === 'failed') {
        // If payment failed, set auction back to draft
        auctionModels.updateAuctionStatus(auctionId, 'draft', (err) => {
          if (err) {
            console.error("Error updating auction status:", err);
          } else {
            console.log(`✅ Auction ${auctionId} status set back to 'draft'`);
          }
        });
      }

      res.status(200).json({ 
        message: `Payment ${status === 'completed' ? 'verified' : 'rejected'} successfully.`,
        auctionId: auctionId,
        paymentStatus: status
      });
    });
  });
};

// Get payment by ID (for admin verification)
const getPaymentById = (req, res) => {
  const { paymentId } = req.params;

  if (!req.admin) {
    return res.status(403).json({ 
      message: "Forbidden: Admin privileges required." 
    });
  }

  paymentsModels.getPaymentById(paymentId, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error.", error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Payment not found." });
    }

    res.status(200).json(results[0]);
  });
};

// Get all pending payments (Admin only)
const getPendingPayments = (req, res) => {
  if (!req.admin) {
    return res.status(403).json({ 
      message: "Forbidden: Admin privileges required." 
    });
  }

  paymentsModels.getAllPendingPayments((err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error.", error: err });
    }

    res.status(200).json(results);
  });
};

// Get user's payment history
const getUserPaymentHistory = (req, res) => {
  const userId = req.user.id;

  paymentsModels.getPaymentsByUserId(userId, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error.", error: err });
    }

    res.status(200).json(results);
  });
};

// Get payment details for a specific auction
const getAuctionPaymentDetails = (req, res) => {
  const { auctionId } = req.params;
  
  // Determine if user is admin
  const isAdmin = req.admin || (req.user && (req.user.role === 'admin' || req.user.role === 'super_admin'));
  const userId = req.user ? req.user.id : null;

  // First check if auction exists
  auctionModels.getAuctionById(auctionId, (err, auctionResults) => {
    if (err) {
      return res.status(500).json({ message: "Database error.", error: err });
    }

    if (auctionResults.length === 0) {
      return res.status(404).json({ message: "Auction not found." });
    }

    const auction = auctionResults[0];

    // If user is not admin, check if they own the auction
    if (!isAdmin) {
      if (!userId || auction.author_id !== userId) {
        return res.status(403).json({ 
          message: "You are not authorized to view this payment information." 
        });
      }
    }

    // Get payment details via payment_id (if exists)
    if (!auction.payment_id) {
      const response = {
        auction: {
          id: auction.id,
          title: auction.title,
          status: auction.status
        },
        payment: null // No payment yet
      };
      return res.status(200).json(response);
    }

    // Get payment details from payments table
    paymentsModels.getPaymentById(auction.payment_id, (err, paymentResults) => {
      if (err) {
        return res.status(500).json({ message: "Database error.", error: err });
      }

      const response = {
        auction: {
          id: auction.id,
          title: auction.title,
          status: auction.status,
          payment_id: auction.payment_id
        },
        payment: paymentResults.length > 0 ? paymentResults[0] : null
      };

      res.status(200).json(response);
    });
  });
};

module.exports = {
  confirmAuctionPayment,
  verifyPayment,
  getPaymentById,
  getPendingPayments,
  getUserPaymentHistory,
  getAuctionPaymentDetails
};