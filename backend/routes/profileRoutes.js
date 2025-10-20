const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { authenticateToken } = require("../middleware/authMiddleware");
const profileController = require("../controllers/profileController");
const signupModels = require("../models/signupModels");

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

// Setup multer storage for cover photos
const coverPhotoStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads/cover_photos/"),
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, "_").replace(/[^\w.-]/g, "");
    cb(null, Date.now() + "-" + safeName);
  },
});

const coverPhotoUpload = multer({ 
  storage: coverPhotoStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for cover photos!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
  }
});

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

// ✅ POST: Upload or replace cover photo
router.post("/profile/cover-photo", authenticateToken, coverPhotoUpload.single("cover_photo"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No cover photo file uploaded." });
  }

  const userId = req.user.id;
  const coverPhotoPath = req.file.filename;

  signupModels.updateUser(userId, { cover_photo: coverPhotoPath }, (err) => {
    if (err) {
      console.error("Database error updating cover photo:", err);
      return res.status(500).json({ message: "Database error.", error: err });
    }

    res.status(200).json({ 
      message: "Cover photo uploaded successfully!", 
      cover_photo: coverPhotoPath 
    });
  });
});

// ✅ DELETE: Remove cover photo
router.delete("/profile/cover-photo", authenticateToken, (req, res) => {
  const userId = req.user.id;
  
  console.log(`DELETE cover photo request for user ID: ${userId}`);

  signupModels.getUserById(userId, (err, results) => {
    if (err) {
      console.error("Database error fetching user:", err);
      return res.status(500).json({ message: "Database error.", error: err });
    }

    if (!results || results.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const user = results[0];
    const coverPhotoPath = user.cover_photo;

    console.log("Current user cover_photo value:", coverPhotoPath);
    console.log("Full user data:", user);

    // Check if cover_photo exists and is not null/empty
    if (!coverPhotoPath || coverPhotoPath === null || coverPhotoPath === 'null' || coverPhotoPath === '') {
      console.log("No cover photo found to delete");
      return res.status(400).json({ message: "No cover photo to delete." });
    }

    const filePath = path.resolve(__dirname, `../uploads/cover_photos/${coverPhotoPath}`);
    console.log("Attempting to delete cover photo at:", filePath);

    // Check if file exists before trying to delete
    fs.access(filePath, fs.constants.F_OK, (accessErr) => {
      if (accessErr) {
        console.log("⚠️ Cover photo file doesn't exist, but will update database anyway");
      } else {
        // Delete file if it exists
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error("⚠️ Error deleting cover photo file:", unlinkErr);
          } else {
            console.log("✅ Cover photo file deleted successfully");
          }
        });
      }

      // Update DB to remove cover_photo reference regardless of file existence
      signupModels.updateUser(userId, { cover_photo: null }, (updateErr) => {
        if (updateErr) {
          console.error("❌ DB error updating cover_photo:", updateErr);
          return res.status(500).json({ message: "Database error.", error: updateErr });
        }

        console.log("✅ Cover photo removed from database");
        return res.status(200).json({ message: "Cover photo removed successfully." });
      });
    });
  });
});

// ✅ GET: Fetch another user's profile by ID
router.get("/profile/:id", authenticateToken, profileController.getUserProfileById);

// ✅ GET: Search profiles by username
router.get("/search", authenticateToken, profileController.searchUsers);

// ✅ PATCH: Toggle commissions
router.patch("/profile/commissions", authenticateToken, profileController.toggleCommissions);

module.exports = router;