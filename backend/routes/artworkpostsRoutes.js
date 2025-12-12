const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const artworkPostsController = require("../controllers/artworkpostsController");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.get("/artwork-posts/following", authenticateToken, artworkPostsController.getFollowingArtworkPosts);

// Create a new artwork post
router.post("/artwork-posts", authenticateToken, upload.array("media", 10), artworkPostsController.createArtworkPost);

// Get all artwork posts
router.get("/artwork-posts", authenticateToken, artworkPostsController.getAllArtworkPosts);

// Get posts by the logged-in user
router.get("/artwork-posts/user", authenticateToken, artworkPostsController.getUserArtworkPosts);

// Get an artwork post by ID
router.get("/artwork-posts/:id", authenticateToken, artworkPostsController.getArtworkPostById);

// Update an artwork post (Only if user is the author)
router.patch("/artwork-posts/:id", authenticateToken, artworkPostsController.updateArtworkPost);

// Delete an artwork post (Only if user is the author)
router.delete("/artwork-posts/:id", authenticateToken, artworkPostsController.deleteArtworkPost);

module.exports = router;
