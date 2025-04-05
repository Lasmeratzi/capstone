const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON request bodies

// Static file serving for uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve files in /uploads folder

// Routes
const signupRoutes = require("./routes/signupRoutes"); // Import signup routes
const loginRoutes = require("./routes/loginRoutes"); // Import login routes
const logoutRoutes = require("./routes/logoutRoutes"); // Import logout routes
const profileRoutes = require("./routes/signupRoutes"); // Adjust the file path if needed
app.use("/api/profiles", profileRoutes); // Mount at /api/profiles

app.use("/api/signup", signupRoutes); // Mount signup routes at /api/signup
app.use("/api/login", loginRoutes); // Mount login routes at /api/login
app.use("/api/logout", logoutRoutes); // Mount logout routes at /api/logout

// Welcome Route
app.get("/", (req, res) => {
  res.send("Welcome to the API! Explore Signup, Login, and Logout APIs.");
});

// Start the Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));