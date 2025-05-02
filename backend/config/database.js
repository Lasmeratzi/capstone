const mysql = require("mysql");
require("dotenv").config(); // Load environment variables from .env file

const db = mysql.createConnection({
  host: process.env.DB_HOST, // Using .env for database host
  user: process.env.DB_USER, // Using .env for database username
  password: process.env.DB_PASSWORD, // Using .env for database password
  database: process.env.DB_NAME, // Using .env for database name
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.stack);
    return;
  }
  console.log("Connected to MySQL database");
});

module.exports = db;