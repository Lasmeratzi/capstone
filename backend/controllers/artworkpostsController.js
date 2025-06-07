const artworkPostsModels = require("../models/artworkpostsModels");

// Create a new artwork post
const createArtworkPost = (req, res) => {
  const authorId = req.user.id;
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title is required." });
  }

  const postData = { author_id: authorId, title, description };

  artworkPostsModels.createArtworkPost(postData, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error.", error: err });
    }
    res.status(201).json({ message: "Artwork post created successfully!", postId: result.insertId });
  });
};

// Get all artwork posts
const getAllArtworkPosts = (req, res) => {
  artworkPostsModels.getAllArtworkPosts((err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error.", error: err });
    }
    res.status(200).json(results);
  });
};

// Get an artwork post by ID
const getArtworkPostById = (req, res) => {
  const { id } = req.params;

  artworkPostsModels.getArtworkPostById(id, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error.", error: err });
    }
    if (!result.length) {
      return res.status(404).json({ message: "Artwork post not found." });
    }
    res.status(200).json(result[0]);
  });
};

// Get posts by the logged-in user
const getUserArtworkPosts = (req, res) => {
  const authorId = req.user.id; // Ensure this comes from authentication

  artworkPostsModels.getArtworkPostsByAuthorId(authorId, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });
    res.status(200).json(results);
  });
};



// Update an artwork post (Only if user is the author)
const updateArtworkPost = (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const authorId = req.user.id;

  artworkPostsModels.getArtworkPostById(id, (err, result) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });
    if (!result.length) return res.status(404).json({ message: "Artwork post not found." });

    const post = result[0];

    if (post.author_id !== authorId) {
      return res.status(403).json({ message: "Unauthorized to update this artwork post." });
    }

    const updatedData = {
      title: title || post.title,
      description: description || post.description,
    };

    artworkPostsModels.updateArtworkPostById(id, updatedData, (updateErr) => {
      if (updateErr) return res.status(500).json({ message: "Database error.", error: updateErr });

      res.status(200).json({ message: "Artwork post updated successfully." });
    });
  });
};

// Delete an artwork post (Only if user is the author)
const deleteArtworkPost = (req, res) => {
  const { id } = req.params;
  const authorId = req.user.id;

  artworkPostsModels.getArtworkPostById(id, (err, result) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });
    if (!result.length) return res.status(404).json({ message: "Artwork post not found." });

    if (result[0].author_id !== authorId) {
      return res.status(403).json({ message: "Unauthorized to delete this artwork post." });
    }

    artworkPostsModels.deleteArtworkPost(id, (deleteErr) => {
      if (deleteErr) return res.status(500).json({ message: "Database error.", error: deleteErr });

      res.status(200).json({ message: "Artwork post deleted successfully!" });
    });
  });
};

module.exports = {
  createArtworkPost,
  getAllArtworkPosts,
  getArtworkPostById,
  getUserArtworkPosts,
  updateArtworkPost,
  deleteArtworkPost,
};