const cron = require('node-cron');
const db = require('../config/database2');
const notificationsModels = require('../models/notificationsModels');

// Updated sendNotification function
const sendNotification = async (userId, type, message) => {
  try {
    console.log("🔔 [ACTIVATION] Sending notification to:", userId, type, message);
    
    await new Promise((resolve, reject) => {
      // Format: (userId, senderId, type, message, callback)
      notificationsModels.createNotification(userId, null, type, message, (err) => {
        if (err) {
          console.error("❌ [ACTIVATION] Notification error:", err);
          reject(err);
        } else {
          console.log("✅ [ACTIVATION] Notification sent");
          resolve();
        }
      });
    });
  } catch (err) {
    console.error("❌ [ACTIVATION] Notification error:", err);
  }
};

const activateScheduledAuctions = () => {
  cron.schedule('* * * * *', async () => { // Check every minute
    try {
      console.log('⏰ [ACTIVATION] Checking for scheduled auctions to activate...');

      const [auctions] = await db.query(
        `SELECT * FROM auctions 
         WHERE status = 'approved' 
         AND auction_start_time <= NOW() 
         AND auction_start_time IS NOT NULL`
      );

      if (!Array.isArray(auctions) || auctions.length === 0) {
        console.log('[ACTIVATION] No auctions to activate at this time.');
        return;
      }

      for (const auction of auctions) {
        console.log(`⏰ [ACTIVATION] Activating auction ID: ${auction.id} - "${auction.title}"`);
        
        // Update status to active
        await db.query(`UPDATE auctions SET status = 'active' WHERE id = ?`, [auction.id]);
        console.log(`✅ [ACTIVATION] Auction ${auction.id} activated and is now live!`);
        
        // Calculate end_time if not set
        if (!auction.end_time && auction.auction_start_time && auction.auction_duration_hours) {
          const startTime = new Date(auction.auction_start_time);
          const endTime = new Date(
            startTime.getTime() + (auction.auction_duration_hours * 60 * 60 * 1000)
          );
          
          await db.query(
            `UPDATE auctions SET end_time = ? WHERE id = ?`,
            [endTime, auction.id]
          );
          console.log(`✅ [ACTIVATION] Updated end_time for auction ${auction.id}: ${endTime}`);
        }
        
        // Notify the auction creator
        await sendNotification(
          auction.author_id,
          'auction_start', // Add type
          `🎉 Your auction "${auction.title}" is now LIVE! The bidding has started and will end on ${auction.end_time || 'the scheduled end time'}.`
        );

        console.log(`📢 [ACTIVATION] Auction ${auction.id} is now active and visible to all users.`);
      }

    } catch (err) {
      console.error('❌ [ACTIVATION] Error activating scheduled auctions:', err);
    }
  });
};

module.exports = activateScheduledAuctions;