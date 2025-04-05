const bcrypt = require("bcrypt");
const db = require("../config/database"); // Import database connection
const multer = require("multer");
const path = require("path");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads")); // Save files in "uploads" folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname); // Generate a unique filename
  },
});

const upload = multer({ storage });

const SignupController = {
  // CREATE: Add a new user
  createUser: (req, res) => {
    const { username, password, email, bio, birthdate } = req.body;

    if (!username || !password || !email || !birthdate) {
      return res.status(400).json({ message: "All required fields must be filled." });
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error("Error hashing password:", err);
        return res.status(500).json({ message: "Server error." });
      }

      const pfp = req.file ? req.file.filename : null;

      const query =
        "INSERT INTO profiles (username, password, email, bio, birthdate, pfp) VALUES (?, ?, ?, ?, ?, ?)";
      db.query(query, [username, hashedPassword, email, bio || null, birthdate, pfp], (err, result) => {
        if (err) {
          console.error("Error creating user:", err);
          return res.status(500).json({ message: "Database error." });
        }
        res.status(201).json({ message: "User created successfully!" });
      });
    });
  },

  // READ: Get all users
  getAllUsers: (req, res) => {
    const query = "SELECT id, username, email, bio, birthdate, pfp FROM profiles";
    db.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching users:", err);
        return res.status(500).json({ message: "Database error." });
      }
      res.status(200).json(results);
    });
  },

  // READ: Get a specific user by ID
  getUserById: (req, res) => {
    const { id } = req.params;
    const query = "SELECT id, username, email, bio, birthdate, pfp FROM profiles WHERE id = ?";
    db.query(query, [id], (err, results) => {
      if (err) {
        console.error("Error fetching user:", err);
        return res.status(500).json({ message: "Database error." });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "User not found." });
      }
      res.status(200).json(results[0]);
    });
  },

  // READ: Get a specific user by username
  getUserByUsername: (req, res) => {
    const { username } = req.params;
    const query = "SELECT id, username, email, bio, birthdate, pfp FROM profiles WHERE username = ?";
    db.query(query, [username], (err, results) => {
      if (err) {
        console.error("Error fetching user by username:", err);
        return res.status(500).json({ message: "Database error." });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "User not found." });
      }
      res.status(200).json(results[0]);
    });
  },

  // UPDATE: Update a user's details
  updateUser: (req, res) => {
    const { id } = req.params;
    const { username, email, bio, birthdate } = req.body;
    const pfp = req.file ? req.file.filename : null;

    const query =
      "UPDATE profiles SET username = ?, email = ?, bio = ?, birthdate = ?, pfp = ? WHERE id = ?";
    db.query(query, [username, email, bio || null, birthdate, pfp, id], (err, result) => {
      if (err) {
        console.error("Error updating user:", err);
        return res.status(500).json({ message: "Database error." });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found." });
      }
      res.status(200).json({ message: "User updated successfully!" });
    });
  },

  // DELETE: Remove a user
  deleteUser: (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM profiles WHERE id = ?";
    db.query(query, [id], (err, result) => {
      if (err) {
        console.error("Error deleting user:", err);
        return res.status(500).json({ message: "Database error." });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found." });
      }
      res.status(200).json({ message: "User deleted successfully!" });
    });
  },
};

module.exports = { SignupController, upload };