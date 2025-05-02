const postsModels = require("../models/postsModels");

// Create a new post
const createPost = (req, res) => {
  console.log("POST /posts - Request received");
  const authorId = req.user.id;
  const { title } = req.body;
  const mediaPath = req.file ? req.file.filename : null;

  if (!title) {
    return res.status(400).json({ message: "Title is required." });
  }

  const postData = { author_id: authorId, title, media_path: mediaPath };

  postsModels.createPost(postData, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error.", error: err });
    }
    res.status(201).json({ message: "Post created successfully!", postId: result.insertId });
  });
};

// Get all posts (Now includes `author_pfp`)
const getAllPosts = (req, res) => {
  const authorId = req.query.author_id;

  postsModels.getAllPosts(authorId, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error.", error: err });
    }
    
    // Ensure response includes author's profile picture
    res.status(200).json(results.map(post => ({
      ...post,
      author_pfp: post.author_pfp || "default.png" // Use default if no profile picture
    })));
  });
};

// Get posts by the logged-in user
const getUserPosts = (req, res) => {
  const authorId = req.user.id;

  postsModels.getPostsByAuthorId(authorId, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error.", error: err });
    }
    res.status(200).json(results);
  });
};

// Get a post by ID (Now includes `author_pfp`)
const getPostById = (req, res) => {
  const { id } = req.params;

  postsModels.getPostById(id, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error.", error: err });
    }
    if (!result.length) {
      return res.status(404).json({ message: "Post not found." });
    }
    
    // Ensure author's profile picture is sent
    res.status(200).json({
      ...result[0],
      author_pfp: result[0].author_pfp || "default.png"
    });
  });
};

// Update a post
const updatePost = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const mediaPath = req.file ? req.file.filename : null;

  if (!title) {
    return res.status(400).json({ message: "Title is required." });
  }

  const postData = { title, media_path: mediaPath };

  postsModels.updatePost(id, postData, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error.", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Post not found or no changes made." });
    }
    res.status(200).json({ message: "Post updated successfully!" });
  });
};

// Delete a post
const deletePost = (req, res) => {
  const { id } = req.params;

  postsModels.deletePost(id, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error.", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Post not found." });
    }
    res.status(200).json({ message: "Post deleted successfully!" });
  });
};

module.exports = {
  createPost,
  getAllPosts,
  getUserPosts,
  getPostById,
  updatePost,
  deletePost,
};