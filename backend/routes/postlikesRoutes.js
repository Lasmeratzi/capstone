const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const postlikesController = require("../controllers/postlikesController");

const router = express.Router();

router.post("/posts/:postId/like", authenticateToken, postlikesController.likePost);
router.delete("/posts/:postId/unlike", authenticateToken, postlikesController.unlikePost);
router.get("/posts/:postId/likes", authenticateToken, postlikesController.getPostLikeCount);
router.get("/posts/:postId/liked", authenticateToken, postlikesController.checkIfUserLikedPost); // new route

module.exports = router;
