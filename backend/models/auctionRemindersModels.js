const db = require("../config/database");

// Check if user already set a reminder for this auction
const checkIfReminderExists = (userId, auctionId, callback) => {
    const sql = 'SELECT id FROM auction_reminders WHERE user_id = ? AND auction_id = ?';
    db.query(sql, [userId, auctionId], (err, results) => {
        if (err) {
            console.error("❌ SQL Error in checkIfReminderExists:", err);
            callback(err, null);
        } else {
            callback(null, results.length > 0);
        }
    });
};

// Add a reminder for user
const addReminder = (userId, auctionId, callback) => {
    const sql = 'INSERT INTO auction_reminders (user_id, auction_id) VALUES (?, ?)';
    db.query(sql, [userId, auctionId], (err, result) => {
        if (err) {
            console.error("❌ SQL Error in addReminder:", err);
            callback(err, null);
        } else {
            callback(null, result.insertId);
        }
    });
};

// Remove a reminder
const removeReminder = (userId, auctionId, callback) => {
    const sql = 'DELETE FROM auction_reminders WHERE user_id = ? AND auction_id = ?';
    db.query(sql, [userId, auctionId], (err, result) => {
        if (err) {
            console.error("❌ SQL Error in removeReminder:", err);
            callback(err, null);
        } else {
            callback(null, result.affectedRows > 0);
        }
    });
};

// Get all reminders for a specific auction (returns user IDs)
const getRemindersByAuction = (auctionId, callback) => {
    const sql = 'SELECT user_id FROM auction_reminders WHERE auction_id = ?';
    db.query(sql, [auctionId], (err, results) => {
        if (err) {
            console.error("❌ SQL Error in getRemindersByAuction:", err);
            callback(err, null);
        } else {
            callback(null, results.map(row => row.user_id));
        }
    });
};

// Get all auctions that user wants reminders for
const getRemindersByUser = (userId, callback) => {
    const sql = 'SELECT auction_id FROM auction_reminders WHERE user_id = ?';
    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error("❌ SQL Error in getRemindersByUser:", err);
            callback(err, null);
        } else {
            callback(null, results.map(row => row.auction_id));
        }
    });
};

// Get reminder details with user info
const getReminderWithUserInfo = (auctionId, callback) => {
    const sql = `
        SELECT 
            ar.*,
            u.username,
            u.fullname,
            u.email
        FROM auction_reminders ar
        JOIN users u ON ar.user_id = u.id
        WHERE ar.auction_id = ?
    `;
    db.query(sql, [auctionId], (err, results) => {
        if (err) {
            console.error("❌ SQL Error in getReminderWithUserInfo:", err);
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
};

module.exports = {
    checkIfReminderExists,
    addReminder,
    removeReminder,
    getRemindersByAuction,
    getRemindersByUser,
    getReminderWithUserInfo
};