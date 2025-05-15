const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config(); // Load environment variables from .env file

const signupRoutes = require("./routes/signupRoutes"); // Import signup routes
const loginRoutes = require("./routes/loginRoutes"); // Import login routes
const logoutRoutes = require("./routes/logoutRoutes"); // Import logout routes
const profileRoutes = require("./routes/profileRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const postsRoutes = require("./routes/postsRoutes");
const chatRoutes = require("./routes/chatRoutes");
const commentsRoutes = require("./routes/commentsRoutes");



const app = express();

// Middleware
app.use(cors()); // Enable CORS for cross-origin requests
app.use(express.json()); // Parse JSON request bodies

// Disable browser caching for authenticated pages
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  res.set("Surrogate-Control", "no-store");
  next();
});

// Static file serving for uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve files from the /uploads folder

// Mount Routes
app.use("/api", signupRoutes); // Mount signup routes under "/api"
app.use("/api", loginRoutes); // Mount login routes under "/api"
app.use("/api", logoutRoutes); // Mount logout routes under "/api"
app.use("/api", profileRoutes); // Mount profile-related routes
app.use("/api", portfolioRoutes);
app.use("/api", postsRoutes); // Register posts-related routes
app.use("/api", chatRoutes); 
app.use("/api", commentsRoutes); // Register comments-related routes

// Welcome Route
app.get("/", (req, res) => {
  res.send("Welcome to the API! Explore Signup, Login, Logout, Profile, Post, Tag, and Bid APIs.");
});

// Start the Server using PORT from .env
const PORT = process.env.PORT || 5000; // Use PORT from .env or default to 5000
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));