const jwt = require("jsonwebtoken");
const signupModels = require("../models/signupModels"); // Import to fetch user details
require("dotenv").config(); // Load environment variables from .env file

// Authenticate token middleware
const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.error("Authorization header missing or improperly formatted.");
      return res.status(401).json({ message: "Unauthorized: Missing token." });
    }

    const token = authHeader.split(" ")[1];
    if (!token || token === "null") {
      console.error("Token is missing or null.");
      return res.status(401).json({ message: "Unauthorized: Invalid token." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error(`JWT verification failed for token: ${token} - Error:`, err);
        return res.status(403).json({ message: "Unauthorized: Invalid token." });
      }

      req.user = decoded; // Attach decoded user info to request object
      next(); // Proceed to the next middleware or route handler
    });
  } catch (error) {
    console.error("Unexpected server error during authentication:", error);
    res.status(500).json({ message: "Server error during authentication.", error });
  }
};

module.exports = { authenticateToken };