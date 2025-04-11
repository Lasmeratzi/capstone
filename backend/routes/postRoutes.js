const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController"); // Correct import for controller
const multer = require("multer"); // Middleware for file uploads

// Configure storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); // Save files to the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Create a new post with media file upload
router.post("/", upload.single("media_file"), postController.createPost); // Removed 'authenticate'

// Fetch all posts
router.get("/", postController.getAllPosts);

// Fetch a single post by ID
router.get("/:id", postController.getPostById);

// Update a post with media file upload
router.put("/:id", upload.single("media_file"), postController.updatePost); // Removed 'authenticate'

// Delete a post
router.delete("/:id", postController.deletePost); // Removed 'authenticate'

module.exports = router;