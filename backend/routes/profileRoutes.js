const express = require("express");
const router = express.Router();
const db = require("../config/database"); // Import the database connection

// GET: Get a user by username
router.get("/:username", (req, res) => {
  const { username } = req.params;

  const query = `
    SELECT id, fullname, username, email, bio, birthdate, pfp, account_status
    FROM profiles
    WHERE username = ?
  `;

  db.query(query, [username], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error." });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const user = results[0];

    // Check if the account is on hold
    if (user.account_status === "on_hold") {
      return res.status(403).json({ message: "Account is on hold. Please contact support." });
    }

    res.status(200).json(user);
  });
});

module.exports = router;