const db = require("../config/database");

// Create a new portfolio item
const createPortfolioItem = (portfolioData, callback) => {
  const sql = `
    INSERT INTO portfolio_items (user_id, title, description, image_path)
    VALUES (?, ?, ?, ?)
  `;
  const params = [
    portfolioData.user_id,
    portfolioData.title,
    portfolioData.description,
    portfolioData.image_path,
  ];
  db.query(sql, params, callback);
};

// Get all portfolio items for a user
const getPortfolioItemsByUser = (userId, callback) => {
  const sql = `
    SELECT id, user_id, title, description, image_path, created_at, updated_at
    FROM portfolio_items
    WHERE user_id = ?
  `;
  db.query(sql, [userId], callback);
};

// Get a portfolio item by ID
const getPortfolioItemById = (id, callback) => {
  const sql = `
    SELECT id, user_id, title, description, image_path
    FROM portfolio_items
    WHERE id = ?
  `;
  db.query(sql, [id], callback);
};

// Update a portfolio item
const updatePortfolioItem = (id, portfolioData, callback) => {
  const sql = `
    UPDATE portfolio_items
    SET title = ?, description = ?, image_path = ?
    WHERE id = ?
  `;
  const params = [
    portfolioData.title,
    portfolioData.description,
    portfolioData.image_path,
    id,
  ];
  db.query(sql, params, callback);
};

// Delete a portfolio item (with ownership check)
const deletePortfolioItem = (id, userId, callback) => {
  // Check ownership
  getPortfolioItemById(id, (err, results) => {
    if (err) return callback(err);
    if (!results.length) return callback(new Error("Portfolio item not found."));
    const portfolioItem = results[0];
    if (portfolioItem.user_id !== userId) {
      return callback(new Error("Unauthorized: User does not own this portfolio item."));
    }

    const sql = `
      DELETE FROM portfolio_items
      WHERE id = ?
    `;
    db.query(sql, [id], callback);
  });
};

module.exports = {
  createPortfolioItem,
  getPortfolioItemsByUser,
  getPortfolioItemById,
  updatePortfolioItem,
  deletePortfolioItem,
};
