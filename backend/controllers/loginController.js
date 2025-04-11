const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/database");

const loginUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  // Query to retrieve user data including account_status
  const query = "SELECT id, fullname, username, password, account_status FROM profiles WHERE email = ?";
  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Server error." });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const user = results[0];

    // Check if the account is on hold
    if (user.account_status === "on_hold") {
      return res.status(403).json({ message: "Your account is on hold. Please contact support." });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user.id }, "your_secret_key", { expiresIn: "1h" });

    res.status(200).json({
      token,
      id: user.id,
      fullname: user.fullname,
      username: user.username,
    });
  });
};

module.exports = { loginUser };