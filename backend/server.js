const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON request bodies

// Routes
const tagRoutes = require("./routes/tagRoutes"); // Import tag routes
app.use("/api/tags", tagRoutes); // Base route for all tag-related APIs

// Welcome Route
app.get("/", (req, res) => {
  res.send("Welcome to the Tags API!");
});

// Start the Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));