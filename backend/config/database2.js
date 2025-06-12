// config/database2.js
const mysql = require("mysql2");
require("dotenv").config();

const db2 = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
}).promise();

module.exports = db2;
