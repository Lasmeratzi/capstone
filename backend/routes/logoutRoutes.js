const express = require("express");
const router = express.Router();
const { logoutUser } = require("../controllers/logoutController");

// POST /api/logout: Logout a user
router.post("/", logoutUser);

module.exports = router;