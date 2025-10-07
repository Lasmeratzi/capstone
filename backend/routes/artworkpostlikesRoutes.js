const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const artworkpostlikesController = require("../controllers/artworkpostlikesController");

const router = express.Router();

router.post("/:artworkPostId/like", authenticateToken, artworkpostlikesController.likeArtworkPost);
router.delete("/:artworkPostId/unlike", authenticateToken, artworkpostlikesController.unlikeArtworkPost);
router.get("/:artworkPostId/likes", authenticateToken, artworkpostlikesController.getArtworkLikeCount);
router.get("/:artworkPostId/liked", authenticateToken, artworkpostlikesController.checkIfUserLikedArtwork);

module.exports = router;
