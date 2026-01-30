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
    SELECT 
      p.id, 
      p.user_id, 
      p.title, 
      p.description, 
      p.image_path, 
      p.created_at, 
      p.updated_at, 
      p.is_sold,
      p.auction_id,
      a.final_price,
      a.current_price,
      a.starting_price,
      a.status AS auction_status,
      a.winner_id,
      w.username AS winner_username,
      w.fullname AS winner_fullname
    FROM portfolio_items p
    LEFT JOIN auctions a ON p.auction_id = a.id
    LEFT JOIN users w ON a.winner_id = w.id
    WHERE p.user_id = ?
    ORDER BY p.created_at DESC
  `;
  db.query(sql, [userId], callback);
};

// Get a portfolio item by ID
const getPortfolioItemById = (id, callback) => {
  const sql = `
    SELECT 
      p.id, 
      p.user_id, 
      p.title, 
      p.description, 
      p.image_path,
      p.is_sold,
      p.auction_id,
      a.final_price,
      a.current_price,
      a.starting_price,
      a.status AS auction_status,
      a.winner_id,
      w.username AS winner_username,
      w.fullname AS winner_fullname
    FROM portfolio_items p
    LEFT JOIN auctions a ON p.auction_id = a.id
    LEFT JOIN users w ON a.winner_id = w.id
    WHERE p.id = ?
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

const updatePortfolioAuctionId = (portfolioItemId, auctionId, callback) => {
  const sql = `
    UPDATE portfolio_items 
    SET auction_id = ? 
    WHERE id = ?
  `;
  db.query(sql, [auctionId, portfolioItemId], callback);
};

module.exports = {
  createPortfolioItem,
  getPortfolioItemsByUser,
  getPortfolioItemById,
  updatePortfolioItem,
  deletePortfolioItem,
  updatePortfolioAuctionId
};
