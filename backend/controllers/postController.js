const postModel = require("../models/postModels");

// Create a New Post
const createPost = async (req, res) => {
  const { content, author_id } = req.body; // Extract author_id from the request body
  const mediaFile = req.file ? `/uploads/${req.file.filename}` : null; // Media file path

  if (!content || !author_id) {
    return res.status(400).json({ message: "Post content and author ID are required." });
  }

  try {
    console.log("Creating post with:", { author_id, content, mediaFile }); // Debug log
    const postId = await postModel.createPost(author_id, content, mediaFile); // Pass the author_id to the model
    res.status(201).json({ message: "Post created successfully.", postId });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Failed to create post." });
  }
};

// Get All Posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await postModel.getAllPosts(); // Fetch posts with author details
    console.log("Posts fetched with author details:", posts); // Debug log
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Failed to fetch posts." });
  }
};

// Get a Single Post by ID
const getPostById = async (req, res) => {
  const { id } = req.params;

  try {
    console.log("Fetching post by ID:", id); // Debug log
    const post = await postModel.getPostById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Failed to fetch post." });
  }
};

// Update a Post
const updatePost = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const mediaFile = req.file ? `/uploads/${req.file.filename}` : null; // Media file path

  if (!content) {
    return res.status(400).json({ message: "Post content is required." });
  }

  try {
    console.log("Updating post:", { id, content, mediaFile }); // Debug log
    const updated = await postModel.updatePost(id, content, mediaFile);
    if (!updated) {
      return res.status(404).json({ message: "Post not found or not updated." });
    }
    res.status(200).json({ message: "Post updated successfully." });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Failed to update post." });
  }
};

// Delete a Post
const deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    console.log("Deleting post with ID:", id); // Debug log
    const deleted = await postModel.deletePost(id);
    if (!deleted) {
      return res.status(404).json({ message: "Post not found or not deleted." });
    }
    res.status(200).json({ message: "Post deleted successfully." });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Failed to delete post." });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
};