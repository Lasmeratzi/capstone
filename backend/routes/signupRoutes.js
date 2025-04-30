const express = require("express");
const multer = require("multer"); // Add Multer
const { authenticateToken } = require("../middleware/authMiddleware"); // Correct middleware import
const signupController = require("../controllers/signupController"); // Import controllers

const upload = multer({ dest: "uploads/" }); // Configure Multer

const router = express.Router();

// Test middleware chain
router.post("/test-upload", upload.single("pfp"), (req, res) => {
  res.status(200).json({ message: "Upload working!" });
});

// Sign-up route (Create user)
router.post("/signup", upload.single("pfp"), signupController.createUser);

// Other routes (example)
router.get("/users", signupController.getAllUsers);
router.get("/users/:id", signupController.getUserById);
router.post("/login", signupController.loginUser);
router.patch("/users/:id/status", authenticateToken, signupController.updateAccountStatus);

module.exports = router;