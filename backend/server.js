const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(cors()); // Enable CORS for cross-origin requests
app.use(express.json()); // Parse JSON request bodies

// Static file serving for uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve files from the /uploads folder

// Routes
const signupRoutes = require("./routes/signupRoutes"); // Signup routes
const loginRoutes = require("./routes/loginRoutes"); // Login routes
const logoutRoutes = require("./routes/logoutRoutes"); // Logout routes
const profileRoutes = require("./routes/profileRoutes"); // Dedicated profile routes
const tagRoutes = require("./routes/tagRoutes"); // Tag routes
const postRoutes = require("./routes/postRoutes"); // Post routes

// Mount Routes
app.use("/api/signup", signupRoutes); // Signup routes
app.use("/api/login", loginRoutes); // Login routes
app.use("/api/logout", logoutRoutes); // Logout routes
app.use("/api/profiles", profileRoutes); // Profile-related operations
app.use("/api/tags", tagRoutes); // Tag routes
app.use("/api/posts", postRoutes); // Post-related operations

// Welcome Route
app.get("/", (req, res) => {
  res.send("Welcome to the API! Explore Signup, Login, Logout, Profile, Post, and Tag APIs.");
});

// Start the Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));