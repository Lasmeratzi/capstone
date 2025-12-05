const cron = require('node-cron');
const db = require('../config/database2');
const notificationsModels = require('../models/notificationsModels');

const sendNotification = async (userId, message) => {
  try {
    console.log("🔔 Sending notification to:", userId, message);
    await notificationsModels.createNotification(userId, message);
    console.log("✅ Notification sent");
  } catch (err) {
    console.error("❌ Notification error:", err);
  }
};

const checkAndEndAuctions = () => {
  cron.schedule('* * * * *', async () => {
    try {
      console.log('⏰ Running auction check...');

      const [auctions] = await db.query(
        `SELECT * FROM auctions WHERE end_time <= NOW() AND status = 'active'`
      );

      if (!Array.isArray(auctions) || auctions.length === 0) {
        console.log('No auctions to end at this time.');
        return;
      }

      for (const auction of auctions) {
        const auctionId = auction.id;

        // End the auction
        await db.query(`UPDATE auctions SET status = 'ended' WHERE id = ?`, [auctionId]);
        console.log(`✅ Auction ${auctionId} ended`);

        // Get highest bid
        const [bids] = await db.query(
          `SELECT b.bidder_id, b.bid_amount, u.username
           FROM auction_bids b
           JOIN users u ON b.bidder_id = u.id
           WHERE b.auction_id = ?
           ORDER BY b.bid_amount DESC
           LIMIT 1`,
          [auctionId]
        );

        if (bids.length > 0) {
          const { bidder_id, bid_amount, username } = bids[0];

          // ✅ FIXED: Use promise-based query
          await db.query(
            `UPDATE auctions 
             SET winner_id = ?, final_price = ?, escrow_status = 'pending_payment' 
             WHERE id = ?`,
            [bidder_id, bid_amount, auctionId]
          );

          console.log(`✅ Winner set for auction ${auctionId}: ${username} with ₱${bid_amount}`);

          // Notify auction author
          await sendNotification(
            auction.author_id,
            `Your auction "${auction.title}" has ended. Highest bidder: @${username} with ₱${bid_amount}. Check your auctions.`
          );

          // Notify top bidder
          await sendNotification(
            bidder_id,
            `You won the auction "${auction.title}" with ₱${bid_amount}. Check your Auction Wins section to proceed with payment.`
          );

        } else {
          // No bids
          await sendNotification(
            auction.author_id,
            `Your auction "${auction.title}" has ended with no bids placed.`
          );
        }
      }

    } catch (err) {
      console.error('❌ Error running auction check:', err);
    }
  });
};

module.exports = checkAndEndAuctions;