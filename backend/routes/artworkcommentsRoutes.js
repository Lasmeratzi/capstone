const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const artworkCommentsController = require("../controllers/artworkcommentsController");

const router = express.Router();

// Create a new comment
router.post("/", authenticateToken, (req, res, next) => {
  console.log("POST /api/artwork-comments called");
  next();
}, artworkCommentsController.createComment);

// Get all comments for an artwork post
router.get("/:artwork_post_id", authenticateToken, (req, res, next) => {
  console.log(`GET /api/artwork-comments/${req.params.artwork_post_id} called`);
  next();
}, artworkCommentsController.getCommentsByArtworkPostId);

// Get a single comment by ID
router.get("/id/:id", authenticateToken, (req, res, next) => {
  console.log(`GET /api/artwork-comments/id/${req.params.id} called`);
  next();
}, artworkCommentsController.getCommentById);

// Update a comment
router.patch("/:id", authenticateToken, (req, res, next) => {
  console.log(`PATCH /api/artwork-comments/${req.params.id} called`);
  next();
}, artworkCommentsController.updateComment);

// Get recent comments for an artwork post
router.get("/recent/:artwork_post_id", authenticateToken, (req, res, next) => {
  console.log(`GET /api/artwork-comments/recent/${req.params.artwork_post_id} called with limit=${req.query.limit}`);
  next();
}, artworkCommentsController.getRecentCommentsByArtworkPostId);

// Get comment count for an artwork post
router.get("/count/:artwork_post_id", authenticateToken, (req, res, next) => {
  console.log(`GET /api/artwork-comments/count/${req.params.artwork_post_id} called`);
  next();
}, artworkCommentsController.getCommentCount);

// Delete a comment
router.delete("/:id", authenticateToken, (req, res, next) => {
  console.log(`DELETE /api/artwork-comments/${req.params.id} called`);
  next();
}, artworkCommentsController.deleteComment);

module.exports = router;
