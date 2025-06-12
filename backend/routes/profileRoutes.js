const express = require("express");
const multer = require("multer");
const { authenticateToken } = require("../middleware/authMiddleware");
const profileController = require("../controllers/profileController");

const router = express.Router();

// Setup multer storage for profile pictures
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// GET: Fetch logged-in user's profile
router.get("/profile", authenticateToken, profileController.getUserProfile);

// PATCH: Update profile (username, bio, pfp)
router.patch("/profile", authenticateToken, upload.single("pfp"), (req, res) => {
  if (req.file) req.body.pfp = req.file.filename;
  profileController.updateProfile(req, res);
});


// GET: Fetch another user's profile by ID
router.get("/profile/:id", authenticateToken, profileController.getUserProfileById);

router.get("/search", authenticateToken, profileController.searchUsers); // Search profiles by username

// PATCH: Toggle commissions (optional, if needed)
router.patch("/profile/commissions", authenticateToken, profileController.toggleCommissions);

module.exports = router;