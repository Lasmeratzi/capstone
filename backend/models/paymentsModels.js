const db = require("../config/database");

// Create a payment record for auction creation fee
const createAuctionPayment = (paymentData, callback) => {
  const sql = `
    INSERT INTO payments (auction_id, payer_id, amount, payment_method, status, paid_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const { auction_id, payer_id, amount, payment_method, status, paid_at } = paymentData;
  db.query(sql, [auction_id, payer_id, amount, payment_method, status, paid_at], callback);
};

// Get payment by auction ID
const getPaymentByAuctionId = (auctionId, callback) => {
  const sql = `
    SELECT * FROM payments 
    WHERE auction_id = ? 
    ORDER BY created_at DESC 
    LIMIT 1
  `;
  db.query(sql, [auctionId], callback);
};

// Update payment status
const updatePaymentStatus = (paymentId, status, callback) => {
  const sql = `
    UPDATE payments 
    SET status = ?, updated_at = CURRENT_TIMESTAMP 
    WHERE id = ?
  `;
  db.query(sql, [status, paymentId], callback);
};

// Get payments by user ID
const getPaymentsByUserId = (userId, callback) => {
  const sql = `
    SELECT p.*, a.title as auction_title, a.status as auction_status
    FROM payments p
    JOIN auctions a ON p.auction_id = a.id
    WHERE p.payer_id = ?
    ORDER BY p.created_at DESC
  `;
  db.query(sql, [userId], callback);
};

// Get all pending payments for admin
const getAllPendingPayments = (callback) => {
  const sql = `
    SELECT p.*, 
           a.title as auction_title,
           u.username as payer_username,
           u.fullname as payer_fullname
    FROM payments p
    JOIN auctions a ON p.auction_id = a.id
    JOIN users u ON p.payer_id = u.id
    WHERE p.status = 'pending'
    ORDER BY p.created_at DESC
  `;
  db.query(sql, callback);
};

const getPaymentById = (paymentId, callback) => {
  const sql = `
    SELECT * FROM payments 
    WHERE id = ? 
  `;
  db.query(sql, [paymentId], callback);
};

module.exports = {
  createAuctionPayment,
  getPaymentByAuctionId,
  updatePaymentStatus,
  getPaymentsByUserId,
  getAllPendingPayments,
  getPaymentById,
};