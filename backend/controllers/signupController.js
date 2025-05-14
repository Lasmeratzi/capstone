const bcrypt = require("bcrypt"); // For password hashing
const jwt = require("jsonwebtoken"); // For token generation
const signupModels = require("../models/signupModels"); // Import signupModels
require("dotenv").config(); // Load environment variables

// Create a new user (Sign-up)
const createUser = async (req, res) => {
  try {
    const { fullname, username, email, password, bio, birthdate } = req.body;
    const pfp = req.file ? req.file.filename : null; // If profile picture is uploaded

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = { fullname, username, email, password: hashedPassword, bio, birthdate, pfp };

    signupModels.createUser(userData, (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ message: "Username or email already exists." });
        }
        return res.status(500).json({ message: "Database error.", error: err });
      }
      res.status(201).json({ message: "User created successfully!", userId: result.insertId });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during sign-up.", error });
  }
};

// Get all registered users
const getAllUsers = (req, res) => {
  signupModels.getAllUsers((err, results) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });
    res.status(200).json(results);
  });
};

// Get a user by ID
const getUserById = (req, res) => {
  const { id } = req.params;
  signupModels.getUserById(id, (err, result) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });
    if (!result.length) return res.status(404).json({ message: "User not found." });
    res.status(200).json(result[0]);
  });
};

// Search users by username
const searchUsers = (req, res) => {
  const { username } = req.query; // Get the search term from query parameters

  signupModels.searchUsersByUsername(username, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });
    res.status(200).json(results); // Return the search results
  });
};

// Log in a user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Search for user by email
    signupModels.searchUserByEmail(email, async (err, results) => {
      if (err) {
        console.error("Database error:", err); // Log database errors
        return res.status(500).json({ message: "Database error.", error: err });
      }
      if (!results.length) {
        return res.status(404).json({ message: "Email not found." });
      }

      const user = results[0];

      // Restrict login if account status is not "active"
      if (user.account_status !== "active") {
        console.warn(`Login attempt blocked for ${email}: Account is ${user.account_status}`);
        return res.status(403).json({
          message: `Login denied: Account is ${user.account_status}.`,
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials." });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "2h" } // Adjust the expiration time as needed
      );

      res.status(200).json({
        message: "Login successful!",
        token,
        id: user.id,
        fullname: user.fullname,
        username: user.username,
        account_status: user.account_status, // Include account_status in login response
        commissions: user.commissions, // Include commissions in login response
      });
    });
  } catch (error) {
    console.error("Login server error:", error); // Log server-side errors
    res.status(500).json({ message: "Server error during login.", error });
  }
};

// Follow a user
const followUser = (req, res) => {
  const { followerId, followedId } = req.body; // Extract follower and followed user IDs from the request body

  signupModels.followUser(followerId, followedId, (err, result) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });
    res.status(201).json({ message: "Followed user successfully!" });
  });
};

// Leave a review for a user
const leaveReview = (req, res) => {
  const { reviewerId, reviewedId, rating, comment } = req.body; // Extract review details

  const reviewData = { reviewerId, reviewedId, rating, comment }; // Organize review data
  signupModels.leaveReview(reviewData, (err, result) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });
    res.status(201).json({ message: "Review submitted successfully!" });
  });
};

// Update account status
const updateAccountStatus = (req, res) => {
  const { id } = req.params; // Extract user ID from request parameters
  const { status } = req.body; // Extract new account status

  console.log("Controller: Updating account status...");
  console.log("User ID:", id);
  console.log("New Status:", status);

  if (!['active', 'on hold', 'banned'].includes(status)) {
    console.error("Invalid status value:", status);
    return res.status(400).json({ message: "Invalid status value." });
  }

  signupModels.updateAccountStatus(id, status, (err, result) => {
    if (err) {
      console.error("Database error during account status update:", err);
      return res.status(500).json({ message: "Database error.", error: err });
    }

    console.log("Account status updated successfully.");
    res.status(200).json({ message: "Account status updated successfully!" });
  });
};

// Toggle commissions status
const toggleCommissions = (req, res) => {
  const { id } = req.user; // Get logged-in user's ID from token middleware
  const { commissions } = req.body; // New commission status (open/closed)

  if (!['open', 'closed'].includes(commissions)) {
    return res.status(400).json({ message: "Invalid commissions value." });
  }

  signupModels.updateUser(id, { commissions }, (err, result) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });
    res.status(200).json({ message: "Commissions status updated successfully!" });
  });
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  searchUsers,
  loginUser,
  followUser, // Reintroduced followUser
  leaveReview, // Reintroduced leaveReview
  updateAccountStatus, // Reintroduced updateAccountStatus
  toggleCommissions,
};