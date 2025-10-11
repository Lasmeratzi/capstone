const tagsModels = require("../models/tagsModels");

// Add tags to an artwork post
const addTagsToPost = async (postId, tagNames) => {
  // tagNames should be an array of tag strings
  if (!Array.isArray(tagNames) || tagNames.length === 0) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    let processed = 0;
    const errors = [];

    tagNames.forEach((tagName) => {
      const cleanTag = tagName.trim().toLowerCase();
      
      if (!cleanTag) {
        processed++;
        if (processed === tagNames.length) {
          errors.length > 0 ? reject(errors) : resolve();
        }
        return;
      }

      // Get or create tag
      tagsModels.getOrCreateTag(cleanTag, (err, tagId) => {
        if (err) {
          errors.push(err);
        } else {
          // Link tag to post
          tagsModels.linkTagToPost(postId, tagId, (linkErr) => {
            if (linkErr && linkErr.code !== 'ER_DUP_ENTRY') {
              // Ignore duplicate entry errors (tag already linked)
              errors.push(linkErr);
            }
          });
        }

        processed++;
        if (processed === tagNames.length) {
          errors.length > 0 ? reject(errors) : resolve();
        }
      });
    });
  });
};

// Get tags for a specific post
const getTagsForPost = (req, res) => {
  const { postId } = req.params;

  tagsModels.getTagsByPostId(postId, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error.", error: err });
    }
    res.status(200).json(results);
  });
};

// Search tags (for autocomplete)
const searchTags = (req, res) => {
  const { query } = req.query;

  if (!query || query.length < 1) {
    return res.status(400).json({ message: "Query parameter is required." });
  }

  tagsModels.searchTags(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error.", error: err });
    }
    res.status(200).json(results);
  });
};

// Get popular tags
const getPopularTags = (req, res) => {
  const limit = parseInt(req.query.limit) || 20;

  tagsModels.getPopularTags(limit, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error.", error: err });
    }
    res.status(200).json(results);
  });
};

// Get all posts with a specific tag
const getPostsByTag = (req, res) => {
  const { tagName } = req.params;

  if (!tagName) {
    return res.status(400).json({ message: "Tag name is required." });
  }

  tagsModels.getPostsByTag(tagName, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error.", error: err });
    }
    res.status(200).json(results);
  });
};

// Update tags for a post (remove old, add new)
const updatePostTags = async (req, res) => {
  const { postId } = req.params;
  const { tags } = req.body; // Array of tag names

  if (!Array.isArray(tags)) {
    return res.status(400).json({ message: "Tags must be an array." });
  }

  try {
    // Remove existing tags
    await new Promise((resolve, reject) => {
      tagsModels.removeTagsFromPost(postId, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    // Add new tags
    await addTagsToPost(postId, tags);

    res.status(200).json({ message: "Tags updated successfully!" });
  } catch (error) {
    console.error("Error updating tags:", error);
    res.status(500).json({ message: "Failed to update tags.", error });
  }
};

// Remove all tags from a post
const removeTagsFromPost = (req, res) => {
  const { postId } = req.params;

  tagsModels.removeTagsFromPost(postId, (err) => {
    if (err) {
      return res.status(500).json({ message: "Database error.", error: err });
    }
    res.status(200).json({ message: "Tags removed successfully!" });
  });
};

// Cleanup unused tags (optional maintenance endpoint)
const cleanupUnusedTags = (req, res) => {
  tagsModels.deleteUnusedTags((err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error.", error: err });
    }
    res.status(200).json({ 
      message: "Unused tags cleaned up successfully!", 
      deletedCount: result.affectedRows 
    });
  });
};

module.exports = {
  addTagsToPost,
  getTagsForPost,
  searchTags,
  getPopularTags,
  getPostsByTag,
  updatePostTags,
  removeTagsFromPost,
  cleanupUnusedTags,
};