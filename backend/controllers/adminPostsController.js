const postsModels = require("../models/postsModels");

// Get ALL posts for admin with filters (no filters, no visibility checks)
const getAllPostsForAdmin = (req, res) => {
  const { userId, status, search } = req.query;
  
  // Build the base SQL query
  let sql = `
    SELECT posts.*, 
           users.username AS author, 
           users.fullname,
           users.pfp AS author_pfp,
           users.id AS user_id
    FROM posts
    JOIN users ON posts.author_id = users.id
    WHERE 1=1
  `;
  
  const params = [];
  
  // Add filters if provided
  if (userId) {
    sql += ` AND posts.author_id = ?`;
    params.push(userId);
  }
  
  if (status && status !== 'all') {
    sql += ` AND posts.post_status = ?`;
    params.push(status);
  }
  
  if (search) {
    sql += ` AND (posts.title LIKE ? OR users.username LIKE ? OR users.fullname LIKE ?)`;
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }
  
  sql += ` ORDER BY posts.created_at DESC`;
  
  const db = require("../config/database");
  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error." });
    }
    
    // Add stats to response
    const stats = {
      total: results.length,
      active: results.filter(p => p.post_status === 'active').length,
      down: results.filter(p => p.post_status === 'down').length
    };
    
    res.status(200).json({ posts: results, stats });
  });
};

// Get user IDs and names for filter dropdown
const getUsersForFilter = (req, res) => {
  const sql = `
    SELECT DISTINCT users.id, users.username, users.fullname
    FROM posts
    JOIN users ON posts.author_id = users.id
    ORDER BY users.username
  `;
  
  const db = require("../config/database");
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error." });
    }
    res.status(200).json(results);
  });
};

// Update post status (Admin only - can update ANY post)
const updatePostStatusAdmin = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["active", "down"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value." });
  }

  // Update ONLY this specific post by ID
  const sql = `UPDATE posts SET post_status = ? WHERE id = ?`;
  const db = require("../config/database");
  
  db.query(sql, [status, id], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error." });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Post not found." });
    }
    
    res.status(200).json({ 
      message: `Post status updated to ${status}.`,
      affectedRows: result.affectedRows // Should be 1
    });
  });
};

// Delete post (Admin only - can delete ANY post)
const deletePostAdmin = (req, res) => {
  const { id } = req.params;
  
  const sql = `DELETE FROM posts WHERE id = ?`;
  const db = require("../config/database");
  
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error." });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Post not found." });
    }
    
    res.status(200).json({ message: "Post deleted successfully!" });
  });
};

module.exports = {
  getAllPostsForAdmin,
  getUsersForFilter,
  updatePostStatusAdmin,
  deletePostAdmin
};