const db = require("../config/database");

// Create a new user
const createUser = (userData, callback) => {
  const sql = `
    INSERT INTO users (fullname, username, email, password, bio, birthdate, pfp, watermark_path, cover_photo)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
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
    userData.cover_photo || null, // Add this line
  ];
  db.query(sql, params, callback);
};

// Get all users
const getAllUsers = (callback) => {
  const sql = `
    SELECT id, fullname, username, email, bio, birthdate, pfp, watermark_path, account_status, commissions, created_at, updated_at, gcash_number, verified, location_id
    FROM users
  `;
  db.query(sql, callback);
};

const getUserById = (id, callback) => {
  const sql = `
    SELECT id, fullname, username, bio, birthdate, pfp, watermark_path, cover_photo, account_status, commissions,
           twitter_link, instagram_link, facebook_link, gcash_number
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
  if (userData.location_id !== undefined) {
    updates.push("location_id = ?");
    values.push(userData.location_id);
  }
  if (userData.cover_photo !== undefined) {
    updates.push("cover_photo = ?");
    values.push(userData.cover_photo);
  }
  if (userData.twitter_link !== undefined) {
    updates.push("twitter_link = ?");
    values.push(userData.twitter_link);
  }
  if (userData.instagram_link !== undefined) {
    updates.push("instagram_link = ?");
    values.push(userData.instagram_link);
  }
  if (userData.facebook_link !== undefined) {
    updates.push("facebook_link = ?");
    values.push(userData.facebook_link);
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
      u.id,
      u.fullname,
      u.username,
      u.bio,
      u.birthdate,
      u.pfp,
      u.watermark_path,
      u.cover_photo, 
      u.account_status,
      u.commissions,
      u.twitter_link,
      u.instagram_link,
      u.facebook_link,
      u.gcash_number,
      u.location_id,
      l.name AS location_name,
      l.province AS location_province,
      vr.status AS verification_request_status
    FROM users u
    LEFT JOIN verification_requests vr ON u.id = vr.user_id
    LEFT JOIN locations l ON u.location_id = l.id
    WHERE u.id = ?
    ORDER BY vr.request_date DESC
    LIMIT 1
  `;
  db.query(sql, [id], callback);
};

// Update GCash number
const updateGcashNumber = (id, gcash_number, callback) => {
  const sql = `
    UPDATE users
    SET gcash_number = ?
    WHERE id = ?
  `;
  db.query(sql, [gcash_number || null, id], callback);
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
  updateGcashNumber,
};
