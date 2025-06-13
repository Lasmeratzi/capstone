const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const followController = require("../controllers/followController");

const router = express.Router();

// Follow a user
router.post("/follow", authenticateToken, followController.followUser);
// Unfollow a user
router.post("/unfollow", authenticateToken, followController.unfollowUser);

// Followers & Following counts
router.get("/followers/count/:userId", authenticateToken, followController.getFollowersCount);
router.get("/following/count/:userId", authenticateToken, followController.getFollowingCount);
router.get("/stats/:userId", authenticateToken, followController.getFollowStats);
router.get("/status/:targetUserId", authenticateToken, followController.checkFollowStatus);


// Lists of followers and following
router.get("/followers/:userId", authenticateToken, followController.getFollowers);
router.get("/following/:userId", authenticateToken, followController.getFollowing);

module.exports = router;
