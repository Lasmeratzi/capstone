const artworkPostsModels = require("../models/artworkpostsModels");
const tagsController = require("./tagsController");

// Create a new artwork post (with tags)
const createArtworkPost = async (req, res) => {
  const authorId = req.user.id;
  const { title, description, tags } = req.body; // tags is an array of strings
  
  if (!title) {
    return res.status(400).json({ message: "Title is required." });
  }

  const postData = { author_id: authorId, title, description };

  artworkPostsModels.createArtworkPost(postData, async (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error.", error: err });
    }

    const postId = result.insertId;

    // Add tags if provided
    if (tags && Array.isArray(tags) && tags.length > 0) {
      try {
        await tagsController.addTagsToPost(postId, tags);
      } catch (tagErr) {
        console.error("Error adding tags:", tagErr);
        // Post created but tags failed - still return success
      }
    }

    res.status(201).json({ 
      message: "Artwork post created successfully!", 
      postId: postId 
    });
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
  const authorId = req.user.id;
  artworkPostsModels.getArtworkPostsByAuthorId(authorId, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });
    res.status(200).json(results);
  });
};

// Update an artwork post (with tags support)
const updateArtworkPost = async (req, res) => {
  const { id } = req.params;
  const { title, description, tags } = req.body;
  const authorId = req.user.id;

  artworkPostsModels.getArtworkPostById(id, async (err, result) => {
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

    artworkPostsModels.updateArtworkPostById(id, updatedData, async (updateErr) => {
      if (updateErr) return res.status(500).json({ message: "Database error.", error: updateErr });

      // Update tags if provided
      if (tags !== undefined && Array.isArray(tags)) {
        try {
          const tagsModels = require("../models/tagsModels");
          
          // Remove old tags
          await new Promise((resolve, reject) => {
            tagsModels.removeTagsFromPost(id, (removeErr) => {
              if (removeErr) return reject(removeErr);
              resolve();
            });
          });

          // Add new tags
          if (tags.length > 0) {
            await tagsController.addTagsToPost(id, tags);
          }
        } catch (tagErr) {
          console.error("Error updating tags:", tagErr);
          // Post updated but tags failed - still return success
        }
      }

      res.status(200).json({ message: "Artwork post updated successfully." });
    });
  });
};

// Delete an artwork post (tags auto-deleted via CASCADE)
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