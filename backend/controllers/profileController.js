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

    res.status(200).json(results[0]); // Return the user's profile data
  });
};

// Toggle commissions status (optional, if needed)
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

module.exports = {
  getUserProfile,
  toggleCommissions, // Include commissions if needed
};