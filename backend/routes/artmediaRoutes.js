const express = require("express");
const multer = require("multer");
const { authenticateToken } = require("../middleware/authMiddleware");
const artmediaController = require("../controllers/artmediaController");

// 👉 Configure multer to use uploads/artwork directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/artwork/');
  },
  filename: (req, file, cb) => {
    cb(null, file.filename); // or file.originalname
  }
});
const upload = multer({ storage });

const router = express.Router();

// Add media to an artwork post (Multiple images)
router.post("/artwork-media", authenticateToken, upload.array("media", 10), artmediaController.addArtworkMedia);

// Get all media for a specific artwork post
router.get("/artwork-media/:postId", authenticateToken, artmediaController.getArtworkMediaByPostId);

// Delete all media for an artwork post
router.delete("/artwork-media/:postId", authenticateToken, artmediaController.deleteArtworkMediaByPostId);

module.exports = router;
