const db = require("../config/database");

// Create a new user
const createUser = (userData, callback) => {
  const sql = `
    INSERT INTO users (fullname, username, email, password, bio, birthdate, pfp)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [
    userData.fullname,
    userData.username,
    userData.email,
    userData.password,
    userData.bio,
    userData.birthdate,
    userData.pfp,
  ];
  db.query(sql, params, callback);
};

// Get all users
const getAllUsers = (callback) => {
  const sql = `
    SELECT id, fullname, username, email, bio, birthdate, pfp, account_status, commissions, created_at, updated_at
    FROM users
  `;
  db.query(sql, callback);
};

// Get a user by ID
const getUserById = (id, callback) => {
  const sql = `
    SELECT id, fullname, username, bio, birthdate, pfp, account_status, commissions
    FROM users
    WHERE id = ?
  `;
  db.query(sql, [id], callback);
};

// Search for users by username (partial match)
const searchUsersByUsername = (username, callback) => {
  const sql = `
    SELECT id, fullname, username, bio, birthdate, pfp, account_status, commissions
    FROM users
    WHERE username LIKE ?
  `;
  db.query(sql, [`%${username}%`], callback);
};

// Search for a user by email
const searchUserByEmail = (email, callback) => {
  const sql = `
    SELECT * FROM users
    WHERE email = ?
  `;
  db.query(sql, [email], callback);
};

// Update a user's details (profile information)
const updateUser = (id, userData, callback) => {
  const sql = `
    UPDATE users
    SET fullname = ?, bio = ?, birthdate = ?, pfp = ?
    WHERE id = ?
  `;
  const params = [
    userData.fullname,
    userData.bio,
    userData.birthdate,
    userData.pfp,
    id,
  ];
  db.query(sql, params, callback);
};

// Update account status (active, on hold, banned)
const updateAccountStatus = (id, status, callback) => {
  const sql = `
    UPDATE users
    SET account_status = ?
    WHERE id = ?
  `;
  console.log("Executing query to update account status:", { id, status });
  db.query(sql, [status, id], callback);
};

// Update commissions field (open or closed)
const updateCommissions = (id, commissions, callback) => {
  const sql = `
    UPDATE users
    SET commissions = ?
    WHERE id = ?
  `;
  db.query(sql, [commissions, id], callback);
};

// Delete a user by ID
const deleteUserById = (id, callback) => {
  const sql = `
    DELETE FROM users
    WHERE id = ?
  `;
  db.query(sql, [id], callback);
};

// Follow a user
const followUser = (followerId, followedId, callback) => {
  const sql = `
    INSERT INTO followers (follower_id, followed_id)
    VALUES (?, ?)
  `;
  db.query(sql, [followerId, followedId], callback);
};

// Leave a review for a user
const leaveReview = (reviewData, callback) => {
  const sql = `
    INSERT INTO reviews (reviewer_id, reviewed_id, rating, comment)
    VALUES (?, ?, ?, ?)
  `;
  const params = [
    reviewData.reviewerId,
    reviewData.reviewedId,
    reviewData.rating,
    reviewData.comment,
  ];
  db.query(sql, params, callback);
};

// Portfolio Items Management
// Create a new portfolio item
const createPortfolioItem = (portfolioData, callback) => {
  const sql = `
    INSERT INTO portfolio_items (user_id, title, description, image_path)
    VALUES (?, ?, ?, ?)
  `;
  const params = [
    portfolioData.user_id,
    portfolioData.title,
    portfolioData.description,
    portfolioData.image_path,
  ];
  db.query(sql, params, callback);
};

// Get all portfolio items for a user
const getPortfolioItemsByUser = (userId, callback) => {
  const sql = `
    SELECT id, title, description, image_path, created_at, updated_at
    FROM portfolio_items
    WHERE user_id = ?
  `;
  db.query(sql, [userId], callback);
};

// Update a portfolio item
const updatePortfolioItem = (id, portfolioData, callback) => {
  const sql = `
    UPDATE portfolio_items
    SET title = ?, description = ?, image_path = ?
    WHERE id = ?
  `;
  const params = [
    portfolioData.title,
    portfolioData.description,
    portfolioData.image_path,
    id,
  ];
  db.query(sql, params, callback);
};

// Delete a portfolio item
const deletePortfolioItem = (id, callback) => {
  const sql = `
    DELETE FROM portfolio_items
    WHERE id = ?
  `;
  db.query(sql, [id], callback);
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  searchUsersByUsername,
  searchUserByEmail,
  updateUser,
  updateAccountStatus,
  updateCommissions,
  deleteUserById,
  followUser,
  leaveReview,
  createPortfolioItem, // Added portfolio CRUD functions
  getPortfolioItemsByUser,
  updatePortfolioItem,
  deletePortfolioItem,
};