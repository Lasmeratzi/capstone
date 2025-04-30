const express = require("express");
const loginController = require("../controllers/loginController"); // Import login controller

const router = express.Router();

// Login route
router.post("/login", loginController.loginUser);

// Logout route
router.post("/logout", loginController.logoutUser);

module.exports = router;