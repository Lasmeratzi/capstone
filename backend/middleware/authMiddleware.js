const jwt = require("jsonwebtoken");
const signupModels = require("../models/signupModels"); // Import to fetch user details
require("dotenv").config(); // Load environment variables from .env file

// Authenticate token middleware
const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: Missing or invalid token format." });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error(`JWT verification failed for token: ${token} - Error:`, err);
        return res.status(403).json({ 
          message: "Unauthorized: Invalid token. Please log in again." 
        });
      }

      req.user = decoded; // Attach decoded user info to request object
      const userId = decoded.id;

      signupModels.getUserById(userId, (err, results) => {
        if (err || !results.length) {
          return res.status(500).json({ message: "User not found or database error." });
        }

        const user = results[0];

        if (user.account_status !== "active") {
          console.warn(`Access blocked for user ID ${userId}: Account is ${user.account_status}`);
          return res.status(403).json({ 
            message: `Access denied: Account is ${user.account_status}.` 
          });
        }

        next(); // Proceed to the next middleware or route handler
      });
    });
  } catch (error) {
    console.error("Unexpected server error during token authentication:", error);
    res.status(500).json({ message: "Server error during authentication.", error });
  }
};

module.exports = { authenticateToken };