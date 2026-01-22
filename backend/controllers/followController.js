const followModels = require("../models/followModels");
const notificationsModels = require("../models/notificationsModels");
const db = require("../config/database");

// Follow a user
const followUser = (req, res) => {
  const followerId = req.user.id;
  const followingId = req.body.targetUserId;

  if (followerId === followingId) {
    return res.status(400).json({ message: "You cannot follow yourself" });
  }

  followModels.followUser(followerId, followingId, (err) => {
    if (err) {
      console.error("Error following user:", err);
      return res.status(500).json({ message: "Failed to follow user" });
    }

    // Fetch follower's username
    db.query("SELECT username FROM users WHERE id = ?", [followerId], (err, results) => {
      if (err) {
        console.error("Failed to fetch follower username:", err);
      }

      const followerUsername = results?.[0]?.username || "Someone";
      const message = `${followerUsername} followed you`;

      notificationsModels.createNotification(
  followingId,   // user_id
  followerId,    // sender_id
  'follow',      // type
  message,       // message
  (err) => {
    if (err) console.error("Failed to create notification:", err);
  }
);
      res.json({ message: "Successfully followed user" });
    });
  });
};

const unfollowUser = (req, res) => {
  const followerId = req.user.id;
  const { targetUserId } = req.body;

  followModels.unfollowUser(followerId, targetUserId, (err, result) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "You are not following this user." });
    }
    res.status(200).json({ message: "Unfollowed successfully." });
  });
};

// Get followers count
const getFollowersCount = (req, res) => {
  const { userId } = req.params;

  followModels.getFollowersCount(userId, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });
    res.status(200).json(results[0]);
  });
};

// Get following count
const getFollowingCount = (req, res) => {
  const { userId } = req.params;

  followModels.getFollowingCount(userId, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });
    res.status(200).json(results[0]);
  });
};

// Get list of followers
const getFollowers = (req, res) => {
  const { userId } = req.params;

  followModels.getFollowers(userId, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });
    res.status(200).json(results);
  });
};

// Get list of following
const getFollowing = (req, res) => {
  const { userId } = req.params;

  followModels.getFollowing(userId, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });
    res.status(200).json(results);
  });
};

// Get both followers and following count
const getFollowStats = (req, res) => {
  const { userId } = req.params;

  followModels.getFollowersCount(userId, (err, followersResult) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });

    followModels.getFollowingCount(userId, (err, followingResult) => {
      if (err) return res.status(500).json({ message: "Database error.", error: err });

      res.status(200).json({
        followers: followersResult[0].followersCount,
        following: followingResult[0].followingCount,
      });
    });
  });
};

// Check if current user is following a target user
const checkFollowStatus = (req, res) => {
  const followerId = req.user.id;
  const { targetUserId } = req.params;

  followModels.checkFollowStatus(followerId, targetUserId, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });

    const isFollowing = results.length > 0;
    res.status(200).json({ isFollowing });
  });
};

module.exports = {
  followUser,
  unfollowUser,
  getFollowersCount,
  getFollowingCount,
  getFollowers,
  getFollowing,
  getFollowStats,
  checkFollowStatus,
};