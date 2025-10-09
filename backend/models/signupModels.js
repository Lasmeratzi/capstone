const db = require("../config/database");

// Create a new user
const createUser = (userData, callback) => {
  const sql = `
    INSERT INTO users (fullname, username, email, password, bio, birthdate, pfp, watermark_path)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [
    userData.fullname,
    userData.username,
    userData.email,
    userData.password,
    userData.bio,
    userData.birthdate,
    userData.pfp,
    userData.watermark_path || null,
  ];
  db.query(sql, params, callback);
};

// Get all users
const getAllUsers = (callback) => {
  const sql = `
    SELECT id, fullname, username, email, bio, birthdate, pfp, watermark_path, account_status, commissions, created_at, updated_at
    FROM users
  `;
  db.query(sql, callback);
};

const getUserById = (id, callback) => {
  const sql = `
    SELECT id, fullname, username, bio, birthdate, pfp, watermark_path, account_status, commissions,
           twitter_link, instagram_link, facebook_link
    FROM users
    WHERE id = ?
  `;
  db.query(sql, [id], callback);
};

const searchUsers = (query, callback) => {
  const sql = `
    SELECT 
      u.id, u.fullname, u.username, u.bio, u.birthdate, u.pfp, u.watermark_path, u.account_status, u.commissions,
      vr.status AS verification_request_status
    FROM users u
    LEFT JOIN verification_requests vr ON u.id = vr.user_id
    WHERE u.username LIKE ? OR u.fullname LIKE ?
    ORDER BY vr.request_date DESC
  `;
  db.query(sql, [`%${query}%`, `%${query}%`], callback);
};

// Search for a user by email
const searchUserByEmail = (email, callback) => {
  const sql = `
    SELECT * FROM users
    WHERE email = ?
  `;
  db.query(sql, [email], callback);
};

const updateUser = (id, userData, callback) => {
  const updates = [];
  const values = [];

  if (userData.username !== undefined) {
    updates.push("username = ?");
    values.push(userData.username);
  }
  if (userData.bio !== undefined) {
    updates.push("bio = ?");
    values.push(userData.bio);
  }
  if (userData.pfp !== undefined) {
    updates.push("pfp = ?");
    values.push(userData.pfp);
  }
  if (userData.watermark_path !== undefined) {
    updates.push("watermark_path = ?");
    values.push(userData.watermark_path);
  }

  if (updates.length === 0) {
    return callback(null, { affectedRows: 0 });
  }

  values.push(id);

  const sql = `UPDATE users SET ${updates.join(", ")} WHERE id = ?`;
  db.query(sql, values, callback);
};

// Update account status (active, on hold, banned)
const updateAccountStatus = (id, newAccountStatus, callback) => {
  const sql = `
    UPDATE users
    SET account_status = ?
    WHERE id = ?
  `;
  db.query(sql, [newAccountStatus, id], callback);
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

const getUserWithVerificationStatusById = (id, callback) => {
  const sql = `
    SELECT 
      u.id, u.fullname, u.username, u.bio, u.birthdate, u.pfp, u.watermark_path, u.account_status, u.commissions,
      u.twitter_link, u.instagram_link, u.facebook_link,
      vr.status AS verification_request_status
    FROM users u
    LEFT JOIN verification_requests vr ON u.id = vr.user_id
    WHERE u.id = ?
    ORDER BY vr.request_date DESC
    LIMIT 1
  `;
  db.query(sql, [id], callback);
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  searchUsers,
  searchUserByEmail,
  updateUser,
  updateAccountStatus,
  updateCommissions,
  deleteUserById,
  getUserWithVerificationStatusById,
};
