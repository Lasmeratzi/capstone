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

// Public route (no auth needed - for landing page)
router.get("/artwork-media/public/:postId", artmediaController.getArtworkMediaByPostId);

router.post("/artwork-media", authenticateToken, upload.array("media", 10), artmediaController.addArtworkMedia);

router.get("/artwork-media/:postId", authenticateToken, artmediaController.getArtworkMediaByPostId);

router.delete("/artwork-media/:postId", authenticateToken, artmediaController.deleteArtworkMediaByPostId);

// Delete a single artwork media
router.delete("/artwork-media/file/:mediaId", authenticateToken, artmediaController.deleteSingleArtworkMedia);


module.exports = router;
