const db = require("../config/database");

// Follow a user
const followUser = (followerId, followingId, callback) => {
  const sql = `
    INSERT INTO follows (follower_id, following_id)
    VALUES (?, ?)
  `;
  db.query(sql, [followerId, followingId], callback);
};

// Unfollow a user
const unfollowUser = (followerId, followingId, callback) => {
  const sql = `
    DELETE FROM follows
    WHERE follower_id = ? AND following_id = ?
  `;
  db.query(sql, [followerId, followingId], callback);
};

// Get followers count for a user
const getFollowersCount = (userId, callback) => {
  const sql = `
    SELECT COUNT(*) AS followersCount
    FROM follows
    WHERE following_id = ?
  `;
  db.query(sql, [userId], callback);
};

// Get following count for a user
const getFollowingCount = (userId, callback) => {
  const sql = `
    SELECT COUNT(*) AS followingCount
    FROM follows
    WHERE follower_id = ?
  `;
  db.query(sql, [userId], callback);
};

// Get list of followers
const getFollowers = (userId, callback) => {
  const sql = `
    SELECT u.id, u.username, u.pfp
    FROM follows f
    JOIN users u ON f.follower_id = u.id
    WHERE f.following_id = ?
  `;
  db.query(sql, [userId], callback);
};

// Get list of following
const getFollowing = (userId, callback) => {
  const sql = `
    SELECT u.id, u.username, u.pfp
    FROM follows f
    JOIN users u ON f.following_id = u.id
    WHERE f.follower_id = ?
  `;
  db.query(sql, [userId], callback);
};

const getFollowStats = (userId, callback) => {
  const sql = `
    SELECT
      (SELECT COUNT(*) FROM follows WHERE following_id = ?) AS followersCount,
      (SELECT COUNT(*) FROM follows WHERE follower_id = ?) AS followingCount
  `;
  db.query(sql, [userId, userId], callback);
};

// Check if a follower is following a target user
const checkFollowStatus = (followerId, targetUserId, callback) => {
  const sql = `
    SELECT * FROM follows
    WHERE follower_id = ? AND following_id = ?
  `;
  db.query(sql, [followerId, targetUserId], callback);
};

module.exports = {
  followUser,
  unfollowUser,
  getFollowersCount,
  getFollowingCount,
  getFollowers,
  getFollowing,
  getFollowStats,
  checkFollowStatus, // 👈 add this
};
