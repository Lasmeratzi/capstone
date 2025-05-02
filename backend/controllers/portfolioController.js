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

// Get portfolio items for a specific user or the logged-in user
const getPortfolioItems = (req, res) => {
  // Check if a userId query parameter is provided (for visited users),
  // otherwise, fallback to the logged-in user's ID
  const userId = req.query.userId || req.user.id;

  signupModels.getPortfolioItemsByUser(userId, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error.", error: err });
    }
    if (!results.length) {
      return res.status(404).json({ message: "No portfolio items found." });
    }
    res.status(200).json(results); // Return portfolio items
  });
};

// Update a portfolio item
const updatePortfolioItem = (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const imagePath = req.file ? req.file.filename : null;

  signupModels.getPortfolioItemById(id, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });
    if (!results.length) return res.status(404).json({ message: "Portfolio item not found." });
  
    const portfolioItem = results[0]; // <--- fix
  
    if (portfolioItem.user_id !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized: You do not own this portfolio item." });
    }
  
    const portfolioData = { title, description, image_path: imagePath };
    signupModels.updatePortfolioItem(id, portfolioData, (err, result) => {
      if (err) return res.status(500).json({ message: "Database error.", error: err });
      res.status(200).json({ message: "Portfolio item updated successfully!" });
    });
  });
  
};

// Delete a portfolio item
const deletePortfolioItem = (req, res) => {
  const { id } = req.params; // Extract portfolio item ID

  // Fetch the portfolio item to validate ownership
  signupModels.getPortfolioItemById(id, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error.", error: err });
    }
    if (!results.length) {
      return res.status(404).json({ message: "Portfolio item not found." });
    }
  
    const portfolioItem = results[0]; // <--- fix
  
    if (portfolioItem.user_id !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized: You do not own this portfolio item." });
    }
  
    signupModels.deletePortfolioItem(id, req.user.id, (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Failed to delete portfolio item.", error: err });
      }
      res.status(200).json({ message: "Portfolio item deleted successfully!" });
    });
  });
  
};

module.exports = {
  createPortfolioItem,
  getPortfolioItems,
  updatePortfolioItem,
  deletePortfolioItem,
};