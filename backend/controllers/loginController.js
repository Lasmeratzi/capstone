const bcrypt = require("bcrypt"); // For password hashing
const jwt = require("jsonwebtoken"); // For token generation
const signupModels = require("../models/signupModels"); // Use the user models
require("dotenv").config(); // Load environment variables

// Log in a user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Debug log: Show the incoming email for debugging
    console.log("Attempting login for email:", email);

    // Search for user by email
    signupModels.searchUserByEmail(email, async (err, results) => {
      if (err) {
        console.error("Database error occurred for email:", email, "Error:", err); // Log detailed database errors
        return res.status(500).json({ message: "Database error.", error: err });
      }

      if (!results.length) {
        console.warn("Email not found:", email); // Log warning if email not found
        return res.status(404).json({ message: "Email not found." });
      }

      const user = results[0];

      // Debugging Log: Account Status
      console.log("Retrieved account_status for email:", email, "-", user.account_status);

      // Restrict login if account status is not "active"
      if (user.account_status.trim().toLowerCase() !== "active") {
        console.warn(
          `Login attempt blocked for ${email}: Account is ${user.account_status}`
        );
        return res.status(403).json({
          message: `Login denied: Account is ${user.account_status}. Please contact support.`,
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      console.log("Password comparison result for email:", email, "-", isValidPassword);

      if (!isValidPassword) {
        console.warn("Invalid password for email:", email); // Log invalid password attempt
        return res.status(401).json({ message: "Invalid credentials." });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h", // Token validity (1 hour)
        }
      );

      console.log("Login successful for user:", user.username); // Debug log for successful login

      // Include account_status in the response
      res.status(200).json({
        message: "Login successful!",
        token,
        id: user.id,
        fullname: user.fullname,
        username: user.username,
        account_status: user.account_status, // Ensure this is sent back to the frontend
      });
    });
  } catch (error) {
    console.error("Server error during login:", error); // Log server-side errors
    res.status(500).json({ message: "Server error during login.", error });
  }
};

// Log out a user (Simulate ending the session)
const logoutUser = (req, res) => {
  res.status(200).json({
    message: "Logout successful! Please clear the token on the client-side.",
  });
};

module.exports = {
  loginUser,
  logoutUser,
};