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

// Search for users by username or fullname (partial match)
const searchUsers = (query, callback) => {
  const sql = `
    SELECT id, fullname, username, bio, birthdate, pfp, account_status, commissions
    FROM users
    WHERE username LIKE ? OR fullname LIKE ?
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
const updateAccountStatus = async (req, res) => {
  const { userId, newAccountStatus } = req.body;  // Renamed `newStatus` to `newAccountStatus`
  
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's account status
    user.accountStatus = newAccountStatus;  // Change from `status` to `accountStatus`
    await user.save();

    // Send response that account status was updated
    res.status(200).json({ message: `Account status updated to ${newAccountStatus}` });

    // If status is "banned" or "on hold", inform the frontend to log out
    if (newAccountStatus === 'banned' || newAccountStatus === 'on hold') {
      res.status(200).json({
        message: 'Account has been banned/on hold, please log out.',
        logoutRequired: true,
      });
    }
  } catch (error) {
    console.error('Error updating account status:', error);
    res.status(500).json({ message: 'Server error.' });
  }
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
  followUser,
  leaveReview,
};
