const cron = require('node-cron');
const db = require('../config/database2');
const notificationsModels = require('../models/notificationsModels');

const sendNotification = async (userId, type, message) => {
  try {
    console.log("🔔 [END REMINDER] Sending notification to user:", userId, type, message);
    // Using the createNotification function with type
    await new Promise((resolve, reject) => {
      // Format: (userId, senderId, type, message, callback)
      notificationsModels.createNotification(userId, null, type, message, (err) => {
        if (err) {
          console.error("❌ [END REMINDER] Notification error:", err);
          reject(err);
        } else {
          console.log("✅ [END REMINDER] Notification sent");
          resolve();
        }
      });
    });
  } catch (err) {
    console.error("❌ [END REMINDER] Notification error:", err);
  }
};

const checkAuctionEndReminders = () => {
  cron.schedule('* * * * *', async () => { // Check every minute
    try {
      console.log('⏰ [END REMINDER] Checking for auctions ending in 10 minutes...');

      // Find auctions that will end in 10 minutes (between 9-10 minutes from now)
      const tenMinutesFromNow = new Date(Date.now() + 10 * 60 * 1000);
      const nineMinutesFromNow = new Date(Date.now() + 9 * 60 * 1000);

      const [auctions] = await db.query(
        `SELECT * FROM auctions 
         WHERE status = 'active'
         AND end_time IS NOT NULL
         AND end_time BETWEEN ? AND ?
         AND end_time > NOW()`, // Make sure it's still in the future
        [nineMinutesFromNow, tenMinutesFromNow]
      );

      if (!Array.isArray(auctions) || auctions.length === 0) {
        console.log('[END REMINDER] No auctions ending in 10 minutes.');
        return;
      }

      console.log(`[END REMINDER] Found ${auctions.length} auction(s) ending soon.`);

      for (const auction of auctions) {
        console.log(`⏰ [END REMINDER] Processing auction ID: ${auction.id} - "${auction.title}"`);
        
        // Get all unique bidders for this auction
        const [bidders] = await db.query(
          `SELECT DISTINCT b.bidder_id, u.username, u.email 
           FROM auction_bids b
           JOIN users u ON b.bidder_id = u.id
           WHERE b.auction_id = ?`,
          [auction.id]
        );

        if (bidders.length === 0) {
          console.log(`[END REMINDER] No bidders for auction ${auction.id}`);
          
          // Still notify the auction owner
          const ownerMessage = `⏰ Your auction "${auction.title}" ends in 10 minutes! No bids yet.`;
          await sendNotification(auction.author_id, 'auction_end', ownerMessage);
          console.log(`✅ [END REMINDER] Sent end reminder to auction owner ${auction.author_id}`);
          
          continue;
        }

        console.log(`[END REMINDER] Sending notifications to ${bidders.length} bidder(s) for auction ${auction.id}`);

        const endTime = new Date(auction.end_time);
        const formattedTime = endTime.toLocaleString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          month: 'short',
          day: 'numeric'
        });

        // Get current highest bid
        const [highestBid] = await db.query(
          `SELECT MAX(bid_amount) as highest_bid FROM auction_bids WHERE auction_id = ?`,
          [auction.id]
        );
        
        const currentBid = highestBid[0]?.highest_bid || auction.starting_price;

        // Send notification to each bidder
        for (const bidder of bidders) {
          const message = `⏰ Auction "${auction.title}" ends in 10 minutes! Current bid: ₱${currentBid}. (Ends: ${formattedTime})`;
          
          await sendNotification(
            bidder.bidder_id,
            'auction_end', // NEW: Add type
            message
          );

          console.log(`✅ [END REMINDER] Sent end reminder to bidder ${bidder.bidder_id} (@${bidder.username})`);
        }

        // Also notify the auction owner
        const ownerMessage = `⏰ Your auction "${auction.title}" ends in 10 minutes! Current highest bid: ₱${currentBid}.`;
        await sendNotification(auction.author_id, 'auction_end', ownerMessage);
        console.log(`✅ [END REMINDER] Sent end reminder to auction owner ${auction.author_id}`);
      }

    } catch (err) {
      console.error('❌ [END REMINDER] Error checking auction end reminders:', err);
    }
  });
};

module.exports = checkAuctionEndReminders;