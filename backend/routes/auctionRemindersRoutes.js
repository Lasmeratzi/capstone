const express = require('express');
const router = express.Router();
const auctionRemindersController = require('../controllers/auctionRemindersController');
const { authenticateToken } = require('../middleware/authMiddleware'); // <-- CHANGED

// All routes require authentication
router.use(authenticateToken); // <-- CHANGED

// Toggle reminder for an auction (POST /api/auctionreminders/toggle)
router.post('/toggle', auctionRemindersController.toggleReminder);

// Check if user has reminder for specific auction (GET /api/auctionreminders/check/:auctionId)
router.get('/check/:auctionId', auctionRemindersController.checkUserReminder);

// Get all auctions user has reminders for (GET /api/auctionreminders/user)
router.get('/user', auctionRemindersController.getUserReminders);

// Get all users who set reminders for an auction (GET /api/auctionreminders/auction/:auctionId)
router.get('/auction/:auctionId', auctionRemindersController.getAuctionReminders);

module.exports = router;