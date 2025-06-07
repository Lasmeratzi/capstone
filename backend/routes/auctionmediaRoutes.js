const express = require("express");
const multer = require("multer");
const path = require("path");
const { authenticateToken } = require("../middleware/authMiddleware");
const auctionMediaController = require("../controllers/auctionMediaController");

// Configure multer for auction uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads/auctions");
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

const router = express.Router();

// Routes
router.post(
  "/auction-media",
  authenticateToken,
  upload.array("media", 10),
  auctionMediaController.addAuctionMedia
);

router.get(
  "/auction-media/:auctionId",
  authenticateToken,
  auctionMediaController.getAuctionMediaByAuctionId
);

router.delete(
  "/auction-media/:auctionId",
  authenticateToken,
  auctionMediaController.deleteAuctionMediaByAuctionId
);

module.exports = router;
