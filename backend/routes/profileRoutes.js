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

// Setup multer storage for watermark uploads (PNG only)
const watermarkStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads/watermarks/"),
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, "_").replace(/[^\w.-]/g, "");
    cb(null, Date.now() + "-" + safeName);
  },
});

const watermarkUpload = multer({ storage: watermarkStorage });

// ✅ GET: Fetch logged-in user's profile
router.get("/profile", authenticateToken, profileController.getUserProfile);

// ✅ PATCH: Update profile (username, bio, pfp)
router.patch("/profile", authenticateToken, upload.single("pfp"), (req, res) => {
  if (req.file) req.body.pfp = req.file.filename;
  profileController.updateProfile(req, res);
});

// ✅ POST: Upload or replace watermark
router.post("/profile/watermark", authenticateToken, watermarkUpload.single("watermark"), profileController.uploadWatermark);

// ✅ DELETE: Remove watermark
router.delete("/profile/watermark", authenticateToken, profileController.deleteWatermark);

// ✅ GET: Fetch another user's profile by ID
router.get("/profile/:id", authenticateToken, profileController.getUserProfileById);

// ✅ GET: Search profiles by username
router.get("/search", authenticateToken, profileController.searchUsers);

// ✅ PATCH: Toggle commissions
router.patch("/profile/commissions", authenticateToken, profileController.toggleCommissions);

module.exports = router;
