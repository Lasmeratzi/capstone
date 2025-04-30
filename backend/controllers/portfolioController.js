const signupModels = require("../models/signupModels"); // Models for database interactions

// Create a new portfolio item
const createPortfolioItem = (req, res) => {
  const userId = req.user.id; // Extract user ID from token
  const { title, description } = req.body; // Extract title and description from the request
  const imagePath = req.file ? req.file.filename : null; // Handle the uploaded image file

  if (!title || !description || !imagePath) {
    return res.status(400).json({ message: "Title, description, and image are required." });
  }

  const portfolioData = { user_id: userId, title, description, image_path: imagePath };

  signupModels.createPortfolioItem(portfolioData, (err, result) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });
    res.status(201).json({ message: "Portfolio item created successfully!", itemId: result.insertId });
  });
};

// Get all portfolio items for the authenticated user
const getPortfolioItems = (req, res) => {
  const userId = req.user.id; // Extract user ID from token

  signupModels.getPortfolioItemsByUser(userId, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });
    if (!results.length) return res.status(404).json({ message: "No portfolio items found." });
    res.status(200).json(results);
  });
};

// Update a portfolio item
const updatePortfolioItem = (req, res) => {
  const { id } = req.params; // Extract item ID from request parameters
  const { title, description } = req.body; // Extract title and description from the request
  const imagePath = req.file ? req.file.filename : null; // Handle optional file upload

  const portfolioData = { title, description, image_path: imagePath };

  signupModels.updatePortfolioItem(id, portfolioData, (err, result) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Portfolio item not found or no changes made." });
    }
    res.status(200).json({ message: "Portfolio item updated successfully!" });
  });
};

// Delete a portfolio item
const deletePortfolioItem = (req, res) => {
  const { id } = req.params; // Extract item ID from request parameters

  signupModels.deletePortfolioItem(id, (err, result) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Portfolio item not found." });
    }
    res.status(200).json({ message: "Portfolio item deleted successfully!" });
  });
};

module.exports = {
  createPortfolioItem,
  getPortfolioItems,
  updatePortfolioItem,
  deletePortfolioItem,
};