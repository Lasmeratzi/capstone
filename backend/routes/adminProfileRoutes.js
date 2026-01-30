const express = require("express");
const authenticateAdmin = require("../middleware/authAdmin");
const signupController = require("../controllers/signupController");
const signupModels = require("../models/signupModels");

const router = express.Router();

// ✅ GET: Get all users (for admin panel) - WITH PAGINATION
router.get("/admin/users", authenticateAdmin, (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;

  // Get total count
  signupModels.getAllUsers((err, allUsers) => {
    if (err) {
      return res.status(500).json({ message: "Database error.", error: err });
    }
    
    // Get paginated users
    const sql = `
      SELECT 
        id, 
        fullname, 
        username, 
        email, 
        bio, 
        birthdate, 
        pfp,
        watermark_path,
        cover_photo,
        account_status,
        commissions,
        verified,
        twitter_link,
        instagram_link,
        facebook_link,
        gcash_number,
        location_id,
        DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at,
        DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') as updated_at
      FROM users 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `;
    
    db.query(sql, [limit, offset], (err, users) => {
      if (err) {
        return res.status(500).json({ message: "Database error.", error: err });
      }
      
      res.status(200).json({
        users,
        pagination: {
          total: allUsers.length,
          page,
          limit,
          totalPages: Math.ceil(allUsers.length / limit)
        }
      });
    });
  });
});

// ✅ GET: Get single user by ID (admin view)
router.get("/admin/users/:id", authenticateAdmin, (req, res) => {
  const { id } = req.params;
  
  const sql = `
    SELECT 
      u.*,
      l.name as location_name,
      l.province as location_province,
      vr.status as verification_status,
      vr.request_date as verification_request_date
    FROM users u
    LEFT JOIN locations l ON u.location_id = l.id
    LEFT JOIN verification_requests vr ON u.id = vr.user_id AND vr.status = 'approved'
    WHERE u.id = ?
    LIMIT 1
  `;
  
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });
    if (!results.length) return res.status(404).json({ message: "User not found." });
    
    res.status(200).json(results[0]);
  });
});

// ✅ PATCH: Update account status
router.patch("/admin/users/:id/status", authenticateAdmin, signupController.updateAccountStatus);

// ✅ PATCH: Update user commissions
router.patch("/admin/users/:id/commissions", authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const { commissions } = req.body;

  if (!['open', 'closed'].includes(commissions)) {
    return res.status(400).json({ message: "Invalid commissions value." });
  }

  signupModels.updateCommissions(id, commissions, (err) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });
    res.status(200).json({ message: "Commissions updated successfully!" });
  });
});

// ✅ PATCH: Update verification status
router.patch("/admin/users/:id/verify", authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const { verified } = req.body;

  const sql = `UPDATE users SET verified = ? WHERE id = ?`;
  db.query(sql, [verified ? 1 : 0, id], (err) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });
    res.status(200).json({ message: `User ${verified ? 'verified' : 'unverified'} successfully!` });
  });
});

// ✅ GET: Search users with filters
router.get("/admin/users/search", authenticateAdmin, (req, res) => {
  const { query, status, verified, sortBy = 'created_at', order = 'DESC' } = req.query;
  
  let sql = `
    SELECT 
      id, fullname, username, email, account_status, commissions, verified,
      DATE_FORMAT(created_at, '%Y-%m-%d') as join_date,
      pfp
    FROM users 
    WHERE 1=1
  `;
  const params = [];

  if (query) {
    sql += ` AND (username LIKE ? OR fullname LIKE ? OR email LIKE ?)`;
    params.push(`%${query}%`, `%${query}%`, `%${query}%`);
  }

  if (status && status !== 'all') {
    sql += ` AND account_status = ?`;
    params.push(status);
  }

  if (verified === 'true') {
    sql += ` AND verified = 1`;
  } else if (verified === 'false') {
    sql += ` AND verified = 0`;
  }

  // Validate sort column to prevent SQL injection
  const validSortColumns = ['created_at', 'username', 'fullname', 'account_status'];
  const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
  const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
  
  sql += ` ORDER BY ${sortColumn} ${sortOrder}`;

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });
    res.status(200).json(results);
  });
});

// ✅ GET: User statistics
router.get("/admin/stats/users", authenticateAdmin, (req, res) => {
  const sql = `
    SELECT 
      COUNT(*) as total_users,
      SUM(CASE WHEN account_status = 'active' THEN 1 ELSE 0 END) as active_users,
      SUM(CASE WHEN account_status = 'on hold' THEN 1 ELSE 0 END) as on_hold_users,
      SUM(CASE WHEN account_status = 'banned' THEN 1 ELSE 0 END) as banned_users,
      SUM(CASE WHEN verified = 1 THEN 1 ELSE 0 END) as verified_users,
      SUM(CASE WHEN commissions = 'open' THEN 1 ELSE 0 END) as open_commissions,
      DATE_FORMAT(MIN(created_at), '%Y-%m-%d') as first_join_date,
      DATE_FORMAT(MAX(created_at), '%Y-%m-%d') as last_join_date
    FROM users
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });
    res.status(200).json(results[0]);
  });
});

module.exports = router;