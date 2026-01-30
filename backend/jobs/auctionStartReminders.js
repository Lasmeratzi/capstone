const cron = require('node-cron');
const db = require('../config/database2');
const notificationsModels = require('../models/notificationsModels');

const sendNotification = async (userId, type, message) => {
  try {
    console.log("🔔 [START REMINDER] Sending notification to user:", userId, type, message);
    
    // Use the createNotification function with type
    await new Promise((resolve, reject) => {
      // Format: (userId, senderId, type, message, callback)
      notificationsModels.createNotification(userId, null, type, message, (err) => {
        if (err) {
          console.error("❌ [START REMINDER] Notification error:", err);
          reject(err);
        } else {
          console.log("✅ [START REMINDER] Notification sent");
          resolve();
        }
      });
    });
  } catch (err) {
    console.error("❌ [START REMINDER] Notification error:", err);
  }
};

const checkAuctionStartReminders = () => {
  cron.schedule('* * * * *', async () => { // Check every minute
    try {
      console.log('⏰ [START REMINDER] Checking for auctions starting in 5 minutes...');

      // Get current time from MySQL (already in correct timezone)
      const [mysqlNow] = await db.query('SELECT NOW() as `current_time`'); // FIXED: Use backticks
      console.log(`⏰ [DEBUG] MySQL current time: ${mysqlNow[0].current_time}`);

      // Find auctions starting in the next 10 minutes
      const [auctions] = await db.query(
        `SELECT *, 
          TIMESTAMPDIFF(MINUTE, NOW(), auction_start_time) as minutes_until_start
         FROM auctions 
         WHERE status IN ('approved', 'pending') 
         AND auction_start_time IS NOT NULL
         AND auction_start_time > NOW()  -- In the future
         AND auction_start_time <= DATE_ADD(NOW(), INTERVAL 5 MINUTE) -- Within next 5 minutes
         ORDER BY auction_start_time ASC`,
        []
      );

      console.log(`[DEBUG] Query found ${auctions.length} auction(s)`);
      
      if (auctions.length === 0) {
        // Debug: Show all upcoming auctions anyway
        const [allUpcoming] = await db.query(
          `SELECT id, title, status, auction_start_time,
           TIMESTAMPDIFF(MINUTE, NOW(), auction_start_time) as minutes_until_start
           FROM auctions 
           WHERE status IN ('approved', 'pending') 
           AND auction_start_time IS NOT NULL
           AND auction_start_time > NOW()
           ORDER BY auction_start_time ASC
           LIMIT 5`
        );
        
        if (allUpcoming.length > 0) {
          console.log(`[DEBUG] But there ARE upcoming auctions (not in 10-min window):`);
          allUpcoming.forEach(auction => {
            console.log(`  - Auction ${auction.id}: "${auction.title}"`);
            console.log(`    Starts in: ${auction.minutes_until_start} minutes (at ${auction.auction_start_time})`);
            console.log(`    Status: ${auction.status}`);
          });
        }
        
        console.log('[START REMINDER] No auctions starting in 10 minutes.');
        return;
      }

      console.log(`[START REMINDER] Found ${auctions.length} auction(s) starting soon.`);

      for (const auction of auctions) {
        console.log(`⏰ [START REMINDER] Processing auction ID: ${auction.id} - "${auction.title}"`);
        console.log(`[DEBUG] Starts in ${auction.minutes_until_start} minutes (at ${auction.auction_start_time})`);
        
        // Get all users who set reminders for this auction
        const [reminders] = await db.query(
          `SELECT ar.user_id, u.username, u.email 
           FROM auction_reminders ar
           JOIN users u ON ar.user_id = u.id
           WHERE ar.auction_id = ?`,
          [auction.id]
        );

        if (reminders.length === 0) {
          console.log(`[START REMINDER] No reminders set for auction ${auction.id}`);
          continue;
        }

        console.log(`[START REMINDER] Sending notifications to ${reminders.length} user(s) for auction ${auction.id}`);

        const startTime = new Date(auction.auction_start_time);
        const formattedTime = startTime.toLocaleString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          month: 'short',
          day: 'numeric'
        });

        // Send notification to each user who set a reminder
        for (const reminder of reminders) {
          let message;
          if (auction.minutes_until_start <= 1) {
            message = `⏰ Auction "${auction.title}" is starting NOW!`;
          } else {
            message = `⏰ Reminder: Auction "${auction.title}" starts in ${auction.minutes_until_start} minutes! (${formattedTime})`;
          }
          
          await sendNotification(
            reminder.user_id,
            'auction_start',
            message
          );

          console.log(`✅ [START REMINDER] Sent start reminder to user ${reminder.user_id} (@${reminder.username}) - ${auction.minutes_until_start} minutes until start`);
        }
      }

    } catch (err) {
      console.error('❌ [START REMINDER] Error checking auction start reminders:', err);
    }
  });
};

module.exports = checkAuctionStartReminders;