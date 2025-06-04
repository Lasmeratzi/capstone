const express = require("express");
const multer = require("multer");
const path = require("path"); // 👈 Add this
const { authenticateToken } = require("../middleware/authMiddleware");
const artmediaController = require("../controllers/artmediaController");

// Configure multer to use uploads/artwork directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads/artwork");
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    if (!file) {
      return cb(new Error("Invalid file"));
    }
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

const router = express.Router();

router.post("/artwork-media", authenticateToken, upload.array("media", 10), artmediaController.addArtworkMedia);

router.get("/artwork-media/:postId", authenticateToken, artmediaController.getArtworkMediaByPostId);

router.delete("/artwork-media/:postId", authenticateToken, artmediaController.deleteArtworkMediaByPostId);

module.exports = router;
