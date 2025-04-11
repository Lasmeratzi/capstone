const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost", // Update if the database host is different
  user: "root", // Your MySQL username
  password: "", // Your MySQL password (empty if none)
  database: "illura", // Your database name
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.stack);
    return;
  }
  console.log("Connected to MySQL database");
});

module.exports = db;