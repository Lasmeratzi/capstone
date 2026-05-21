const db = require("../config/database");

const getDashboardStats = (req, res) => {
  const statsQueries = {
    userStats: `
      SELECT 
        COUNT(*) as totalUsers,
        SUM(CASE WHEN account_status = 'active' THEN 1 ELSE 0 END) as activeUsers,
        SUM(CASE WHEN account_status = 'on hold' THEN 1 ELSE 0 END) as onHoldUsers,
        SUM(CASE WHEN account_status = 'banned' THEN 1 ELSE 0 END) as bannedUsers,
        SUM(CASE WHEN verified = 1 THEN 1 ELSE 0 END) as verifiedUsers,
        SUM(CASE WHEN commissions = 'open' THEN 1 ELSE 0 END) as openCommissions
      FROM users
    `,
    auctionStats: `
      SELECT 
        COUNT(*) as totalAuctions,
        SUM(CASE WHEN status = 'active' AND end_time > NOW() THEN 1 ELSE 0 END) as activeAuctions,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approvedAuctions,
        SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as draftAuctions,
        SUM(CASE WHEN status = 'ended' THEN 1 ELSE 0 END) as endedAuctions,
        SUM(CASE WHEN status = 'active' AND end_time BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 24 HOUR) THEN 1 ELSE 0 END) as endingSoon,
        SUM(CASE WHEN status = 'ended' AND final_price IS NOT NULL THEN final_price ELSE 0 END) as totalRevenue,
        SUM(CASE WHEN escrow_status = 'pending_payment' THEN 1 ELSE 0 END) as pendingPayment,
        SUM(CASE WHEN escrow_status = 'completed' THEN 1 ELSE 0 END) as completedAuctions
      FROM auctions
    `,
    postStats: `SELECT COUNT(*) as totalPosts FROM posts`,
    artworkStats: `SELECT COUNT(*) as totalArtworks FROM artwork_posts`,
    verificationStats: `SELECT COUNT(*) as pendingVerifications FROM verification_requests WHERE status = 'pending'`,
    reportStats: `SELECT COUNT(*) as totalReports FROM reports`,
    popularTags: `
      SELECT t.name, COUNT(at.tag_id) as usage_count
      FROM tags t
      JOIN artwork_tags at ON t.id = at.tag_id
      GROUP BY t.id
      ORDER BY usage_count DESC
      LIMIT 5
    `,
    activityHours: `
      SELECT HOUR(created_at) as hour, COUNT(*) as count
      FROM (
        SELECT created_at FROM users
        UNION ALL
        SELECT created_at FROM auctions
        UNION ALL
        SELECT created_at FROM artwork_posts
      ) as combined_activity
      GROUP BY hour
      ORDER BY count DESC
      LIMIT 1
    `,
    recentActivities: `
      (SELECT 'user' as type, username as title, created_at, '' as icon FROM users)
      UNION ALL
      (SELECT 'auction' as type, title, created_at, '' as icon FROM auctions)
      UNION ALL
      (SELECT 'post' as type, title, created_at, '' as icon FROM posts)
      ORDER BY created_at DESC
      LIMIT 10
    `
  };

  const results = {};
  const queries = Object.keys(statsQueries);
  let completed = 0;

  queries.forEach(key => {
    db.query(statsQueries[key], (err, data) => {
      completed++;
      if (err) {
        console.error(`Error in query ${key}:`, err);
      } else {
        results[key] = (key === 'recentActivities' || key === 'popularTags') ? data : data[0];
      }

      if (completed === queries.length) {
        // Determine most active time string
        const hour = results.activityHours?.hour;
        let mostActiveTime = "Evening (6-10 PM)";
        if (hour !== undefined) {
          if (hour >= 5 && hour < 12) mostActiveTime = "Morning (5-11 AM)";
          else if (hour >= 12 && hour < 17) mostActiveTime = "Afternoon (12-4 PM)";
          else if (hour >= 17 && hour < 22) mostActiveTime = "Evening (5-9 PM)";
          else mostActiveTime = "Night (10 PM-4 AM)";
        }

        // Format the final response to match frontend expectations
        const finalStats = {
          ...results.userStats,
          activeAuctions: results.auctionStats?.activeAuctions || 0,
          totalPosts: (results.postStats?.totalPosts || 0) + (results.artworkStats?.totalArtworks || 0),
          pendingVerifications: results.verificationStats?.pendingVerifications || 0,
          totalReports: results.reportStats?.totalReports || 0,
          auctionStats: results.auctionStats || {},
          recentActivities: formatActivities(results.recentActivities || []),
          popularTags: results.popularTags?.map(t => t.name) || [],
          mostActiveTime: mostActiveTime
        };
        res.status(200).json(finalStats);
      }
    });
  });
};

const formatActivities = (activities) => {
  return activities.map(act => {
    const now = new Date();
    const created = new Date(act.created_at);
    const diffMs = now - created;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    let timeAgo;
    if (diffMins < 60) timeAgo = `${diffMins}m ago`;
    else if (diffHours < 24) timeAgo = `${diffHours}h ago`;
    else timeAgo = `${diffDays}d ago`;

    let message = "";
    if (act.type === 'user') message = `User @${act.title} registered`;
    else if (act.type === 'auction') message = `New auction: ${act.title}`;
    else if (act.type === 'post') message = `New post: ${act.title}`;

    return {
      message,
      timeAgo,
      icon: act.icon,
      created_at: act.created_at
    };
  });
};

module.exports = { getDashboardStats };
