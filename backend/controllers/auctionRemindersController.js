const auctionRemindersModels = require("../models/auctionRemindersModels");

// ✅ Toggle reminder for an auction
const toggleReminder = (req, res) => {
    console.log("🔹 Toggle reminder request received:", req.body);

    const { auctionId } = req.body;
    const userId = req.user.id; // From auth middleware

    if (!auctionId || !userId) {
        return res.status(400).json({ 
            success: false,
            message: "Auction ID and user authentication are required." 
        });
    }

    // ✅ Step 1: Check if reminder already exists
    auctionRemindersModels.checkIfReminderExists(userId, auctionId, (checkErr, exists) => {
        if (checkErr) {
            console.error("🔹 Database error checking reminder:", checkErr);
            return res.status(500).json({ 
                success: false,
                message: "Database error." 
            });
        }

        if (exists) {
            // ✅ Step 2a: Remove existing reminder
            auctionRemindersModels.removeReminder(userId, auctionId, (removeErr, removed) => {
                if (removeErr) {
                    console.error("🔹 Database error removing reminder:", removeErr);
                    return res.status(500).json({ 
                        success: false,
                        message: "Database error." 
                    });
                }
                
                console.log("🔹 Reminder removed successfully");
                res.json({
                    success: true,
                    message: 'Reminder removed',
                    hasReminder: false
                });
            });
        } else {
            // ✅ Step 2b: Add new reminder
            auctionRemindersModels.addReminder(userId, auctionId, (addErr, reminderId) => {
                if (addErr) {
                    console.error("🔹 Database error adding reminder:", addErr);
                    return res.status(500).json({ 
                        success: false,
                        message: "Database error." 
                    });
                }
                
                console.log("🔹 Reminder added successfully, ID:", reminderId);
                res.json({
                    success: true,
                    message: 'Reminder set! You will be notified when the auction goes live.',
                    hasReminder: true
                });
            });
        }
    });
};

// ✅ Check if user has reminder for a specific auction
const checkUserReminder = (req, res) => {
    const { auctionId } = req.params;
    const userId = req.user.id;

    console.log(`🔹 Checking reminder for auction ${auctionId}, user ${userId}`);

    if (!auctionId || !userId) {
        return res.status(400).json({ 
            success: false,
            message: "Auction ID and user authentication are required." 
        });
    }

    auctionRemindersModels.checkIfReminderExists(userId, auctionId, (err, exists) => {
        if (err) {
            console.error("🔹 Database error checking reminder:", err);
            return res.status(500).json({ 
                success: false,
                message: "Database error." 
            });
        }
        
        console.log("🔹 Reminder check result:", exists);
        res.json({
            success: true,
            hasReminder: exists
        });
    });
};

// ✅ Get all auctions that user has reminders for
const getUserReminders = (req, res) => {
    const userId = req.user.id;
    
    console.log(`🔹 Getting all reminders for user ${userId}`);

    auctionRemindersModels.getRemindersByUser(userId, (err, auctionIds) => {
        if (err) {
            console.error("🔹 Database error getting user reminders:", err);
            return res.status(500).json({ 
                success: false,
                message: "Database error." 
            });
        }
        
        console.log("🔹 User reminders found:", auctionIds.length);
        res.json({
            success: true,
            reminders: auctionIds
        });
    });
};

// ✅ Get all users who set reminders for an auction (for admin/notification sending)
const getAuctionReminders = (req, res) => {
    const { auctionId } = req.params;
    
    console.log(`🔹 Getting all reminders for auction ${auctionId}`);

    auctionRemindersModels.getReminderWithUserInfo(auctionId, (err, reminders) => {
        if (err) {
            console.error("🔹 Database error getting auction reminders:", err);
            return res.status(500).json({ 
                success: false,
                message: "Database error." 
            });
        }
        
        console.log("🔹 Auction reminders found:", reminders.length);
        res.json({
            success: true,
            reminders: reminders
        });
    });
};

module.exports = {
    toggleReminder,
    checkUserReminder,
    getUserReminders,
    getAuctionReminders
};