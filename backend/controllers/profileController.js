const signupModels = require("../models/signupModels"); // Use existing models for database interaction
// Get logged-in user's profile with verification status
const getUserProfile = (req, res) => {
  const userId = req.user.id;

  signupModels.getUserWithVerificationStatusById(userId, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });
    if (!results.length) return res.status(404).json({ message: "User not found." });

    const user = results[0];
    res.status(200).json({
  id: user.id,
  fullname: user.fullname,
  username: user.username,
  bio: user.bio,
  birthdate: user.birthdate,
  pfp: user.pfp,
  account_status: user.account_status,
  commissions: user.commissions,
  verification_request_status: user.verification_request_status || "none",
  isVerified: user.verification_request_status === "approved",
  twitter_link: user.twitter_link,
  instagram_link: user.instagram_link,
  facebook_link: user.facebook_link
});

  });
};

// Fetch any user's profile by ID (with verification status)
const getUserProfileById = (req, res) => {
  const { id } = req.params;

  signupModels.getUserWithVerificationStatusById(id, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });
    if (!results.length) return res.status(404).json({ message: "User not found." });

    const user = results[0];
    res.status(200).json({
  id: user.id,
  fullname: user.fullname,
  username: user.username,
  bio: user.bio,
  birthdate: user.birthdate,
  pfp: user.pfp,
  account_status: user.account_status,
  commissions: user.commissions,
  verification_request_status: user.verification_request_status || "none",
  isVerified: user.verification_request_status === "approved",
  twitter_link: user.twitter_link,
  instagram_link: user.instagram_link,
  facebook_link: user.facebook_link
});

  });
};


// Toggle commissions status
const toggleCommissions = (req, res) => {
  const userId = req.user.id; // Extract user ID from token
  const { commissions } = req.body;

  if (!["open", "closed"].includes(commissions)) {
    return res.status(400).json({ message: "Invalid commissions value." });
  }

  signupModels.updateCommissions(userId, commissions, (err) => {
    if (err) {
      return res.status(500).json({ message: "Database error.", error: err });
    }
    res.status(200).json({ message: "Commissions status updated successfully!" });
  });
};

// Search users by username (partial match)
const searchUsers = (req, res) => {
  const { query } = req.query; // Extract search term from query parameters

  signupModels.searchUsers(query, (err, results) => { // Call the new 'searchUsers' function
    if (err) {
      return res.status(500).json({ message: "Database error.", error: err });
    }
    if (!results.length) {
      return res.status(404).json({ message: "No users found." });
    }
    res.status(200).json(results); // Return matching users
  });
};

const updateProfile = (req, res) => {
  const userId = req.user.id;
  const { username, bio, pfp } = req.body;

  if (!username && !bio && !pfp) {
    return res.status(400).json({ message: "At least one field is required for update." });
  }

  signupModels.updateUser(userId, { username, bio, pfp }, (err) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });

    res.status(200).json({ message: "Profile updated successfully!" });
  });
};

module.exports = {
  getUserProfile,
  getUserProfileById,
  toggleCommissions,
  searchUsers,
  updateProfile, // 👈 don't forget this!
};
