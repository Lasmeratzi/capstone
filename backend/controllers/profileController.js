const signupModels = require("../models/signupModels"); // Use existing models for database interaction

// Get logged-in user's profile
const getUserProfile = (req, res) => {
  const userId = req.user.id; // Extract user ID from token (authenticateToken middleware)

  signupModels.getUserById(userId, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error.", error: err });
    }
    if (!results.length) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(results[0]); // Return the logged-in user's profile data
  });
};

// Fetch any user's profile by ID
const getUserProfileById = (req, res) => {
  const { id } = req.params; // Extract user ID from request parameters

  signupModels.getUserById(id, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error.", error: err });
    }
    if (!results.length) {
      return res.status(404).json({ message: "User not found." });
    }

    // Return the profile data (exclude sensitive fields like password)
    const user = {
      id: results[0].id,
      fullname: results[0].fullname,
      username: results[0].username,
      bio: results[0].bio,
      birthdate: results[0].birthdate,
      pfp: results[0].pfp,
      commissions: results[0].commissions,
    };

    res.status(200).json(user);
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

module.exports = {
  getUserProfile,
  getUserProfileById,
  toggleCommissions,
  searchUsers, // Ensure the correct function is exported
};