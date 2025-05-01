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

// Get all posts
const getAllPosts = (req, res) => {
  postsModels.getAllPosts((err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error.", error: err });
    }
    res.status(200).json(results);
  });
};

// Get a post by ID
const getPostById = (req, res) => {
  const { id } = req.params;

  postsModels.getPostById(id, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error.", error: err });
    }
    if (!result.length) {
      return res.status(404).json({ message: "Post not found." });
    }
    res.status(200).json(result[0]);
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
  getPostById,
  updatePost,
  deletePost,
};