const Tag = require("../models/tagModels"); // Import the tag model

// Fetch all tags
const getAllTags = (req, res) => {
  Tag.getAll((err, results) => {
    if (err) {
      console.error("Error fetching tags:", err);
      return res.status(500).json({ message: "Database error." });
    }
    res.status(200).json(results); // Send all tags as a response
  });
};

// Add a new tag
const createTag = (req, res) => {
  const { tag_name, tag_created } = req.body; // Removed tag_id

  if (!tag_name || !tag_created) {
    return res.status(400).json({ message: "All fields are required." });
  }

  Tag.create(tag_name, tag_created, (err, result) => {
    if (err) {
      console.error("Error creating tag:", err);
      return res.status(500).json({ message: "Database error." });
    }
    res.status(201).json({ id: result.insertId, tag_name, tag_created }); // Use result.insertId for the tag ID
  });
};

// Update an existing tag
const updateTag = (req, res) => {
  const { id } = req.params; // Changed tag_id to id
  const { tag_name, tag_created } = req.body;

  if (!tag_name || !tag_created) {
    return res.status(400).json({ message: "All fields are required for update." });
  }

  Tag.update(id, tag_name, tag_created, (err, result) => {
    if (err) {
      console.error("Error updating tag:", err);
      return res.status(500).json({ message: "Database error." });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Tag not found." });
    }

    res.status(200).json({ message: "Tag updated successfully!" });
  });
};

// Remove a tag
const deleteTag = (req, res) => {
  const { id } = req.params; // Changed tag_id to id

  Tag.remove(id, (err, result) => {
    if (err) {
      console.error("Error deleting tag:", err);
      return res.status(500).json({ message: "Database error." });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Tag not found." });
    }

    res.status(200).json({ message: "Tag deleted successfully!" });
  });
};

module.exports = { getAllTags, createTag, updateTag, deleteTag };