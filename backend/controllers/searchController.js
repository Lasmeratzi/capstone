const db = require("../config/database"); // Import your database connection

// Search for accounts based on a query
const searchAccounts = (req, res) => {
  const { query } = req.query;

  if (!query) {
    console.error("Search query is missing.");
    return res.status(400).json({ message: "Search query is required." });
  }

  console.log("Search query received:", query); // Log received query for debugging

  const searchQuery = `
    SELECT id, fullname, username, email, bio, birthdate, pfp, account_status
    FROM profiles
    WHERE username LIKE ? OR email LIKE ? OR fullname LIKE ?
  `;

  db.query(searchQuery, [`%${query}%`, `%${query}%`, `%${query}%`], (err, results) => {
    if (err) {
      console.error("Database error:", err); // Log database errors
      return res.status(500).json({ message: "Database error." });
    }

    if (results.length === 0) {
      console.log("No matching accounts found.");
      return res.status(404).json({ message: "No accounts found." });
    }

    console.log("Search results:", results); // Log results
    res.status(200).json(results); // Send the search results back
  });
};

module.exports = { searchAccounts }; // Export the search function