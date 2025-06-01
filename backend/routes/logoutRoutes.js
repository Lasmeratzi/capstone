const express = require("express");
const logoutController = require("../controllers/logoutController"); // Import logout controller

const router = express.Router();

// Logout route
router.post("/logout", logoutController.logoutUser);

module.exports = router;